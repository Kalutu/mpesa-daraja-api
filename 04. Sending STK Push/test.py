import requests
import base64
import json
from datetime import datetime

def generate_access_token():
    consumer_key = "zGAGVGaI7rtD61KHGAxhXLdHjoMrAhUsVofTI61vObNwr0mU"
    consumer_secret = "SJ4eNopkpDlO0LKOQR9n0oxD8PcCZ6V2upNGsyb1cHoYAuMFgRVWUh5RNP9DyG5S"

    #choose one depending on you development environment
    #sandbox
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    #live
    # url = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

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

def send_stk_push():
    token = generate_access_token()
    url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')

    shortCode = "174379"
    passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
    stk_password = base64.b64encode((shortCode + passkey + timestamp).encode()).decode()

    request_body = {
        "BusinessShortCode": "174379",
        "Password": stk_password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": "10",
        "PartyA": "254114511133",
        "PartyB": "174379",
        "PhoneNumber": "254114511133",
        "CallBackURL": "http://janjaprogrammers.com/",
        "AccountReference": "account",
        "TransactionDesc": "test"
    }

    response = requests.post(url, json=request_body, headers=headers)
    print(response.json())


send_stk_push()