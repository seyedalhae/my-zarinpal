# ZARINPAL.COM API

`my-zarinpal` allows you to communicate with the Zarinpal API to facilitate online payments. The API key for your Zarinpal account is required to create a new instance of the `Zarinpal` class.

## Installation

This package is available on npm as [`my-zarinpal`](https://www.npmjs.com/package/my-zarinpal). You can install it using either npm or yarn.

With npm:

```bash
npm install my-zarinpal
```

With yarn:

```bash
yarn add my-zarinpal
```

## Using

To use this class in your Javascript or Typescript code, first import it:

```javascript
import { Zarinpal } from "my-zarinpal";
```

Then create a new instance of the Zarinpal class using your ZARINPAL.COM API key.

```typescript
const zarinpal = new Zarinpal("YOUR_ZARINPAL_API_KEY");
```

Then you can use the methods of the Zarinpal class to interact with the ZARINPAL.COM API. For example, to send a single SMS message to a single recipient:

```typescript
zarinpal.pay(params: object): Promise<object>;

// Creates a payment request.
```

```typescript
interface IPayParams {
    amount: string,
	currency: CurrencyType,
	metadata: IMetadata,
	callback_url: string,
	description: string,
}

type CurrencyType = "IRT" | "IRR";

interface IMetadata {
	mobile: string,
	email: string,
}

const params: IPayParams = {
	amount: "PAYABLE_AMOUNT,
	currency: "CURRENCY_METHOD",
	metadata: {
		mobile: "MOBILE_NUMBER",
		email: "EMAIL_ADDRESS",
	},
	callback_url: `CALLBACL_URL`,
	description: "PAYMENT_DESCRIPTION",
};
```

params (object): The payment parameters.
amount (string): The amount of the payment.
currency (string): The currency of the payment (e.g., "IRT").
metadata (object): Metadata for the payment.
mobile (string): The recipient's mobile number.
email (string): The recipient's email address.
callback_url (string): The URL to which the user will be redirected after the payment.
description (string): A description of the payment.
Returns a promise that resolves to the response object from the Zarinpal API.
