/**
 * Interface representing data required for a payment transaction.
 */
interface IPayData {
	merchant_id?: string; // Unique identifier for the merchant
	amount: string; // Amount of the transaction
	currency: string; // Currency
	description: string; // Description of the transaction
	callback_url: string; // URL to redirect users after payment
	metadata: IMetaData; // Metadata
}

interface IMetaData {
	mobile?: string;
	email?: string;
	order_id?: string;
}

interface IVerifyData {
	merchant_id?: string; // Unique identifier for the merchant
	amount: string; // Amount of the transaction
	authority: string; // Authority
}

interface IPayResponse {
	status?: any;
	code?: any;
	authority?: any;
	url?: any;
	fee?: any;
	fee_type?: any;
	message?: any;
}

interface IVerifyResponse {
	status?: any;
	wages?: any;
	code?: any;
	message?: any;
	card_hash?: any;
	card_pan?: any;
	ref_id?: any;
	fee_type?: any;
	fee?: any;
	shaparak_fee?: any;
	order_id?: any;
}

/**
 * Class representing Zarinpal payment gateway integration.
 */
export class Zarinpal {
	private apiUrl: string = "https://api.zarinpal.com/pg/v4/payment"; // Production API URL
	// private apiSandBoxUrl: string =
	// 	"https://sandbox.zarinpal.com/pg/rest/WebGate/"; // Sandbox API URL
	// private zarinpalAPISuffix = {
	// 	// API endpoints suffixes
	// 	PR: "PaymentRequest.json",
	// 	PRX: "PaymentRequestWithExtra.json",
	// 	PV: "PaymentVerification.json",
	// 	PVX: "PaymentVerificationWithExtra.json",
	// 	RA: "RefreshAuthority.json",
	// 	UT: "UnverifiedTransactions.json",
	// };

	private merchantIDLength: number = 36; // Length of the merchant ID
	private token: string; // Merchant token for authentication
	// private isSandBox: boolean; // Indicates if sandbox environment is used

	constructor(token: string) {
		if (typeof token !== "string") {
			throw new Error("MerchantId is invalid");
		}
		if (token.length === this.merchantIDLength) {
			this.token = token;
		} else {
			console.error(
				"The MerchantID must be " + this.merchantIDLength + " Characters."
			);
		}
		this.token = token;
		// this.isSandBox = isSandBox || false;
	}

	async pay(data: IPayData): Promise<IPayResponse> {
		let url: string = `${this.apiUrl}/request.json`;

		// if (this.isSandBox) {
		// 	url = `${this.apiSandBoxUrl}${this.zarinpalAPISuffix.PR}`;
		// } else {
		// 	url = `${this.apiUrl}${this.zarinpalAPISuffix.PR}`;
		// }

		const params = {
			merchant_id: this.token,
			amount: data?.amount,
			currency: data?.currency,
			description: data?.description,
			callback_url: data?.callback_url,
			metadata: data?.metadata,
		};

		try {
			// Make HTTP request
			const response = await fetch(url, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(params),
			});

			console.log("Response Status:", response.status);
			const responseBody = await response.json();
			console.log("Response Body:", responseBody);

			if (response.status == 200) {
				const { authority, fee, fee_type, code, message } = responseBody.data;
				return {
					code,
					authority,
					url: this.whatUrl(authority),
					fee,
					fee_type,
					message,
				};
			} else {
				return { status: 500, authority: false, url: false };
			}
		} catch (error) {
			console.error("Error:", error);
			return { status: 500, authority: false, url: false };
		}
	}

	async verify(data: IVerifyData): Promise<IVerifyResponse> {
		let url: string = `${this.apiUrl}/verify.json`;

		const params = {
			merchant_id: this.token,
			amount: data.amount,
			authority: data.authority,
		};

		try {
			// Make HTTP request
			const response = await fetch(url, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(params),
			});

			console.log("Response Status:", response.status);
			const responseBody = await response.json();
			console.log("Response Body:", responseBody);

			if (response.status == 200) {
				const {
					wages,
					code,
					message,
					card_hash,
					card_pan,
					ref_id,
					fee_type,
					fee,
					shaparak_fee,
					order_id,
				} = responseBody.data;

				return {
					wages,
					code,
					message,
					card_hash,
					card_pan,
					ref_id,
					fee_type,
					fee,
					shaparak_fee,
					order_id,
				};
			} else {
				return { status: 500 };
			}
		} catch (error) {
			console.error("Error:", error);
			return { status: 500 };
		}
	}

	/**
	 * Private method to determine the appropriate payment URL based on sandbox mode.
	 * @param authority Authority received from Zarinpal API
	 * @returns Payment URL
	 */
	private whatUrl(authority: string): string {
		// if (this.isSandBox) {
		// 	return "https://sandbox.zarinpal.com/pg/StartPay/" + authority;
		// } else {
		return "https://www.zarinpal.com/pg/StartPay/" + authority;
		// }
	}
}
