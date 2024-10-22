# M-PESA DARAJA Payment APIs Walkthrough

At this point, we should have the following details:

- **Consumer Key**
- **Consumer Secret**
- **PassKey**

Safaricom M-PESA DARAJA provides several payment APIs. In this session, we focus on two key APIs:

- **Authorization API**
- **M-Pesa Express**

---

## Authorization API

This API generates a token used to authenticate all other APIs provided by Safaricom DARAJA.  
The token generated will be passed as **Authorization Headers** in all subsequent API requests.

> **Note:** The token expires after a few seconds, so it must be generated before each request.

### Generating the Token

To generate the token, follow these steps:

1. Create a Base-64 encoding of `Consumer Key + ":" + Consumer Secret`.
2. Send a GET request to the appropriate endpoint based on the environment:

   - **Sandbox:** `https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`
   - **Live:** `https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`

3. Set the `Authorization` header to `Basic [encoded_credentials]`.

### Node.js Sample Code

```javascript
const axios = require('axios');

const getAccessToken = () => {

    const consumerKey = yourConsumerKey
    const consumerSecret = yourConsumerKey

    //choose one depending on you development environment
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",  //sandbox
    const url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",  //live

  try {

    const encodedCredentials = new Buffer.from(consumerKey + ":" + consumerSecret).toString('base64');

    const headers = {
      'Authorization': "Basic" + " " + encodedCredentials',
      'Content-Type': 'application/json'
    };

    const response = await axios.get(url, { headers });
    return response.data.access_token;
  } catch (error) {

    throw new Error('Failed to get access token.');
  }
}
```

### Python Sample Code

```python
import base64
import json
import requests

def generate_access_token():
    consumer_key = "yourConsumerKey"
    consumer_secret = "yourConsumerSecret"

    #choose one depending on you development environment
    #sandbox
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    #live
    url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    try:

        encoded_credentials = base64.b64encode(f"{consumer_key}:{consumer_secret}".encode()).decode()


        headers = {
            "Authorization": f"Basic {encoded_credentials}",
            "Content-Type": "application/json"
        }

        # Send the request and parse the response
        response = requests.get(url, headers=headers).json()

        # Check for errors and return the access token
        if "access_token" in response:
            return response["access_token"]
        else:
            raise Exception("Failed to get access token: " + response["error_description"])
    except Exception as e:
        raise Exception("Failed to get access token: " + str(e))
```

---

## M-PESA Express API

The **M-PESA Express** API allows merchants to initiate transactions from online systems. A payment prompt (STK Push) is sent to the customer’s phone to enter their M-Pesa PIN and complete the payment.

### Steps to Send STK Push

1. **Generate the Timestamp**  
    This is the current timestamp in the format: `YYYYMMDDHHMMSS`.

   #### Node.js

   ```javascript
   const date = new Date();
   const timestamp =
     date.getFullYear() +
     ("0" + (date.getMonth() + 1)).slice(-2) +
     ("0" + date.getDate()).slice(-2) +
     ("0" + date.getHours()).slice(-2) +
     ("0" + date.getMinutes()).slice(-2) +
     ("0" + date.getSeconds()).slice(-2);
   //you can use momentjs to generate the same in one line
   ```

   #### Python

   ```python
   from datetime import datetime

   timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
   ```

2. **Generate the STK Password**  
    This is a Base64-encoded value of the concatenation of `Shortcode + PassKey + Timestamp`.

   **NB: Incase of till number, the Shorcode is the store number**

   #### Node.js

   ```javascript
   const shortCode = "YOUR_PAYBILL";
   const passkey = "YOUR_PASSKEY";
   const timestamp = "generatedtimestamp";
   const stk_password = new Buffer.from(
     shortCode + passkey + timestamp
   ).toString("base64");
   ```

   #### Python

   ```python
   import base64

   shortCode = "YOUR_PAYBILL"
   passkey = "YOUR_PASSKEY"
   timestamp = "generatedtimestamp"
   stk_password = base64.b64encode((shortCode + passkey + timestamp).encode()).decode()
   ```

3. **Prepare the Request Body**

   ```json
   {
     "BusinessShortCode": "174379",
     "Password": "generatedpassword",
     "Timestamp": "generatedtimestamp",
     "TransactionType": "CustomerPayBillOnline",
     "Amount": "10",
     "PartyA": "254713118765",
     "PartyB": "174379",
     "PhoneNumber": "254713118765",
     "CallBackURL": "https://yourwebsite.co.ke/callbackurl",
     "AccountReference": "account",
     "TransactionDesc": "test"
   }
   ```

   **BusinessShortCode**
   This is the paybill number for paybils and store number for till numbers

   **Password**
   This is the generated password from step 1.

   **TimeStamp**
   This is the generated password from step 2.

   **TransactionType**
   for paybills [CustomerPayBillOnline] and [CustomerBuyGoodsOnline] for buy goods Till

   **PartyA**
   The Customers phone number, Startig with 254

   **PartyB**
   Same with shortcode for paybill. For till numbers, we enter the till number on this section

   **PhoneNumber**
   Same as the PartyA

   **CallBackURL**
   Will discuss this in later sessions here

   **AccountReference**
   Account number for paybills.

   **TransactionDesc**
   Purpose of payment, just any string value. 4. **Set Authorization Headers**

4. **Set Authorization Headers**

   #### Node.js

   ```javascript
   const token = await generateToken();
   const headers = {
     Authorization: "Bearer " + token,
     "Content-Type": "application/json",
   };
   ```

   #### Python

   ```python
    token = generateToken()
    headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
   ```

5. **Send the STK Push Request**

   A POST request to [https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest]

   #### Node.js

   ```javascript
   const axios = require("axios");

   const sendStkPush = async () => {
     const token = await getAccessToken();
     const url =
       "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

     const headers = {
       Authorization: `Bearer ${token}`,
       "Content-Type": "application/json",
     };

     const requestBody = {
       BusinessShortCode: "174379",
       Password: stk_password,
       Timestamp: timestamp,
       TransactionType: "CustomerPayBillOnline",
       Amount: "10",
       PartyA: "254708374149",
       PartyB: "174379",
       PhoneNumber: "254708374149",
       CallBackURL: "https://yourwebsite.co.ke/callbackurl",
       AccountReference: "account",
       TransactionDesc: "test",
     };

     try {
       const response = await axios.post(url, requestBody, { headers });
       console.log(response.data);
     } catch (error) {
       console.error("Error sending STK Push:", error.message);
     }
   };
   ```

   #### Python

   ```python
   import requests

   def send_stk_push():
       token = generate_access_token()
       url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

       headers = {
           "Authorization": f"Bearer {token}",
           "Content-Type": "application/json"
       }

       request_body = {
           "BusinessShortCode": "174379",
           "Password": stk_password,
           "Timestamp": timestamp,
           "TransactionType": "CustomerPayBillOnline",
           "Amount": "10",
           "PartyA": "254708374149",
           "PartyB": "174379",
           "PhoneNumber": "254708374149",
           "CallBackURL": "https://yourwebsite.co.ke/callbackurl",
           "AccountReference": "account",
           "TransactionDesc": "test"
       }

       response = requests.post(url, json=request_body, headers=headers)
       print(response.json())
   ```
