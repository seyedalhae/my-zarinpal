export class Zarinpal {
	private apiUrl: string = "";
	private apiSandBoxUrl: string =
		"https://sandbox.zarinpal.com/pg/rest/WebGate/";

	private token: string;
	private isSandBox: boolean;

	constructor(token: string, isSandBox: boolean) {
		this.token = token;
		this.isSandBox = isSandBox;
	}

	async pay(
		urlSuffix: string,
		method: "GET" | "POST" | "DELETE" = "POST",
		data: object | undefined = undefined
	): Promise<any> {
		// const url = `${this.apiUrl}${urlSuffix}`;
		let url: string = "";
		if (this.isSandBox) {
			url = `${this.apiSandBoxUrl}${urlSuffix}`;
		} else {
			url = `${this.apiUrl}${urlSuffix}`;
		}

		const response = await fetch(url, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			method,
			body: JSON.stringify(data),
		});

		console.log("Response Status:", response.status);
	}
}
