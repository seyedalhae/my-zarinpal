/**
 * Interface representing data required for a payment transaction.
 */
interface IData {
	MerchantID?: string; // Unique identifier for the merchant
	Amount: string; // Amount of the transaction
	CallbackURL: string; // URL to redirect users after payment
	Description: string; // Description of the transaction
	Email: string; // Email address of the user
	Mobile: string; // Mobile number of the user
}

/**
 * Class representing Zarinpal payment gateway integration.
 */
export class Zarinpal {
	private apiUrl: string = "https://www.zarinpal.com/pg/rest/WebGate/"; // Production API URL
	private apiSandBoxUrl: string =
		"https://sandbox.zarinpal.com/pg/rest/WebGate/"; // Sandbox API URL
	private zarinpalAPISuffix = {
		// API endpoints suffixes
		PR: "PaymentRequest.json",
		PRX: "PaymentRequestWithExtra.json",
		PV: "PaymentVerification.json",
		PVX: "PaymentVerificationWithExtra.json",
		RA: "RefreshAuthority.json",
		UT: "UnverifiedTransactions.json",
	};

	private merchantIDLength: number = 36; // Length of the merchant ID
	private token: string; // Merchant token for authentication
	private isSandBox: boolean; // Indicates if sandbox environment is used

	constructor(token: string, isSandBox?: boolean) {
		if (typeof token !== "string") {
			throw new Error("MerchantId is invalid");
		}
		if (token.length === this.merchantIDLength) {
			this.token = token;
		} else {
			console.error(
				"The MerchantID must be " +
					this.merchantIDLength +
					" Characters."
			);
		}
		this.token = token;
		this.isSandBox = isSandBox || false;
	}

	async pay(data: IData): Promise<any> {
		let url: string = "";
		if (this.isSandBox) {
			url = `${this.apiSandBoxUrl}${this.zarinpalAPISuffix.PR}`;
		} else {
			url = `${this.apiUrl}${this.zarinpalAPISuffix.PR}`;
		}

		const params = {
			MerchantID: this.token,
			Amount: data?.Amount,
			CallbackURL: data?.CallbackURL,
			Description: data?.Description,
			Email: data?.Email,
			Mobile: data?.Mobile,
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
				return {
					status: responseBody.Status,
					authority: responseBody.Authority,
					url: this.whatUrl(responseBody.Authority),
				};
			} else {
				return { status: 500, authority: false, url: false };
			}
		} catch (error) {
			console.error("Error:", error);
			return { status: 500, authority: false, url: false };
		}
	}

	/**
	 * Private method to determine the appropriate payment URL based on sandbox mode.
	 * @param authority Authority received from Zarinpal API
	 * @returns Payment URL
	 */
	private whatUrl(authority: string): string {
		if (this.isSandBox) {
			return "https://sandbox.zarinpal.com/pg/StartPay/" + authority;
		} else {
			return "https://www.zarinpal.com/pg/StartPay/" + authority;
		}
	}
}
