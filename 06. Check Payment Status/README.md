# M-Pesa Express Query Walkthrough

In this section, we focus on querying the status of an M-Pesa Express (STK Push) transaction using Safaricom’s Daraja API. This helps verify if the transaction was successful, failed, or is still pending.

At this point, you should have the following details:

- Business Short Code
- Checkout Request ID (from the initial STK Push response)

## M-Pesa Express Query API Overview

This API checks the status of an STK Push request initiated earlier using Lipa na M-PESA Online. It’s useful for confirming if a payment went through without relying on the callback URL response.

### Steps to Query the Status of an STK Push

1. **Generate the Timestamp**  
   The Timestamp is required to create the Password for your query.

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
     "CheckoutRequestID": "ws_CO_270720231629123456"
   }
   ```

   **BusinessShortCode**
   This is the paybill number for paybils and store number for till numbers

   **Password**
   This is the generated password from step 1.

   **TimeStamp**
   This is the generated password from step 2.

   **CheckoutRequestID**
   This is the ID received from the initial STK Push request.

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

5. **Send the Query Request**

   #### API Endpoint:

   Sandbox: https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query
   Live: https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query

   #### Node.js

   ```javascript
   const axios = require("axios");

   const queryStkPush = async (checkoutRequestID) => {
     const token = await getAccessToken();
     const url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";

     const headers = {
       Authorization: `Bearer ${token}`,
       "Content-Type": "application/json",
     };

     const requestBody = {
       BusinessShortCode: "174379",
       Password: password,
       Timestamp: timestamp,
       CheckoutRequestID: checkoutRequestID,
     };

     try {
       const response = await axios.post(url, requestBody, { headers });
       console.log("Query Response:", response.data);
     } catch (error) {
       console.error("Error querying STK Push:", error.message);
     }
   };

   queryStkPush("ws_CO_270720231629123456");
   ```

   #### Python

   ```python
   import requests

    def query_stk_push(checkout_request_id):
        url = "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query"
        access_token = generate_access_token()  # Generate your token here

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        request_body = {
            "BusinessShortCode": "174379",
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }

        response = requests.post(url, json=request_body, headers=headers)
        print("Query Response:", response.json())

    query_stk_push("ws_CO_270720231629123456")
   ```

### Sample Response

```json
{
  "ResponseCode": "0",
  "ResponseDescription": "The service request has been accepted successfully.",
  "MerchantRequestID": "23423-324234-32423",
  "CheckoutRequestID": "ws_CO_270720231629123456",
  "ResultCode": "0",
  "ResultDesc": "The transaction was successful."
}
```

**ResponseCode:** Indicates the success or failure of the query request.

**ResultCode:** The result of the payment.

- **0:** Successful transaction
- **1:** Insufficient funds
- **1032:** Request cancelled by user

**ResultDesc:** Description of the result.

---

### Summary

The M-Pesa Express Query API helps you track the status of transactions initiated via STK Push. It ensures the merchant stays informed about the payment status without relying solely on callback responses.

This process involves:

1. Generating the timestamp and password.
2. Preparing the query request.
3. Sending the request with proper headers.
4. Parsing the response to check the transaction status.
