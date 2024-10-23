# M-Pesa STK Push Callback Handling

## Overview

This repository demonstrates how to handle M-Pesa STK Push callback data in both **Node.js** and **Python (Django)**.
It covers both success and failure scenarios while ensuring you correctly interpret and respond to callback requests.

## Handling Callback Data

Once you send an STK push request, Safaricom validates the request by checking if the body parameters and authentication headers are correct.

### Common Errors in STK Push Request

- **Incorrect or typo** in the URL endpoint
- **Bad format** in one of the body parameters
- **Incorrect encoding** of the STK password
- **Authentication token** validation failed

If the STK push request is successful, an STK prompt will be sent to the user’s phone. **Note:** Just successfully sending the push does not guarantee that the payment will succeed.

### Callback Data from M-Pesa

After the user completes or cancels the transaction, M-Pesa sends the callback data to the URL provided in the `callbackURL` parameter of the initial request.

- **Valid Callback URL Format:** `https://mywebsite.com/path`
- **Local Development:** Use **ngrok** to open a live tunnel to your localhost, as localhost URLs won't work for live callbacks.

---

## Callback Data Example

### Successful Transaction

```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "12345-67890-12345",
      "CheckoutRequestID": "abcdefghijklmnopqrstuvwxyz",
      "ResultCode": 0,
      "ResultDesc": "The service was accepted successfully",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 100 },
          { "Name": "MpesaReceiptNumber", "Value": "ABCDEFGHIJ" },
          { "Name": "Balance", "Value": 0 },
          { "Name": "TransactionDate", "Value": "2023-04-26 12:30:00" },
          { "Name": "PhoneNumber", "Value": "254712345678" }
        ]
      }
    }
  }
}
```

### Failed Transaction

```json
{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "12345-67890-12345",
      "CheckoutRequestID": "abcdefghijklmnopqrstuvwxyz",
      "ResultCode": 1032,
      "ResultDesc": "Request cancelled by user"
    }
  }
}
```

---

## Code Implementation

### Node.js

```javascript
app.post("/callback", (req, res) => {
  const callbackData = req.body;

  // Check the result code
  const result_code = callbackData.Body.stkCallback.ResultCode;
  if (result_code !== 0) {
    const error_message = callbackData.Body.stkCallback.ResultDesc;
    return res.json({ ResultCode: result_code, ResultDesc: error_message });
  }

  const body = callbackData.Body.stkCallback.CallbackMetadata;

  const amount = body.Item.find((obj) => obj.Name === "Amount").Value;
  const mpesaCode = body.Item.find(
    (obj) => obj.Name === "MpesaReceiptNumber"
  ).Value;
  const phone = body.Item.find((obj) => obj.Name === "PhoneNumber").Value;

  console.log(`Transaction Successful: ${amount}, ${mpesaCode}, ${phone}`);

  return res.json("success");
});
```

### Python (Django)

```python
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def mpesa_callback(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Only POST requests are allowed")

    try:
        # Parse the callback data from the request body
        callback_data = json.loads(request.body)

        # Check the result code
        result_code = callback_data["Body"]["stkCallback"]["ResultCode"]
        if result_code != 0:
            # Handle unsuccessful transaction
            error_message = callback_data["Body"]["stkCallback"]["ResultDesc"]
            return JsonResponse({"ResultCode": result_code, "ResultDesc": error_message})

        # Extract metadata from the callback
        body = callback_data["Body"]["stkCallback"]["CallbackMetadata"]["Item"]

        # Find specific fields in the metadata
        amount = next(item["Value"] for item in body if item["Name"] == "Amount")
        mpesa_code = next(item["Value"] for item in body if item["Name"] == "MpesaReceiptNumber")
        phone = next(item["Value"] for item in body if item["Name"] == "PhoneNumber")

        # Log transaction details
        print(f"Transaction Successful: Amount: {amount}, Code: {mpesa_code}, Phone: {phone}")

        # Return a success response to M-Pesa
        return JsonResponse("success", safe=False)

    except (json.JSONDecodeError, KeyError) as e:
        # Handle errors gracefully
        return HttpResponseBadRequest(f"Invalid request data: {str(e)}")

```

---

## Security Tips

- Ensure that the callback URL is confidential to prevent unauthorized access.
- Validate all incoming data to prevent tampering.

---

## Conclusion

This example demonstrates how to handle both successful and failed transactions using Node.js and Django. It is crucial to differentiate between these scenarios using the `ResultCode` or the presence of `CallbackMetadata`. This ensures your application responds correctly to M-Pesa events.
