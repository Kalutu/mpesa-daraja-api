const axios = require("axios");
const moment = require("moment");
const Transaction = require("../models/Transaction");

// 1. Send STK Push
const sendStkPush = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;

    // Validate the required fields
    if (!phoneNumber || !amount) {
      return res.status(400).json({
        error: "Phone number and amount are required fields.",
      });
    }

    // Generate timestamp in format YYYYMMDDHHMMSS
    const timestamp = moment().format("YYYYMMDDHHmmss");

    // Generate password (Base64-encoded Shortcode + PassKey + Timestamp)
    const businessShortCode = process.env.SHORTCODE;
    const passKey = process.env.PASSKEY;
    const password = Buffer.from(
      `${businessShortCode}${passKey}${timestamp}`
    ).toString("base64");

    // Prepare the request body
    const requestBody = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: businessShortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: "account",
      TransactionDesc: "test",
    };

    // Set authorization headers
    const headers = {
      Authorization: `Bearer ${req.darajaToken}`,
    };

    // Send the STK push request to Safaricom
    const response = await axios.post(
      `${process.env.BASE_URL}/mpesa/stkpush/v1/processrequest`,
      requestBody,
      { headers }
    );

    // Handle the response from Safaricom
    if (response.data.ResponseCode === "0") {
      return res.status(200).json({
        message: "STK push request sent successfully.",
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        responseDescription: response.data.ResponseDescription,
      });
    } else {
      return res.status(400).json({
        error: "Failed to initiate STK push.",
        responseDescription: response.data.ResponseDescription,
      });
    }
  } catch (error) {
    console.error("Error initiating STK push:", error.message);

    // Handle network or API errors
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data,
      });
    }

    return res.status(500).json({
      error: "An error occurred while initiating STK push.",
    });
  }
};

// 2. Handle Callback from M-Pesa
const handleCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    // Check the result code to determine success or failure
    const result_code = callbackData.Body.stkCallback.ResultCode;
    if (result_code !== 0) {
      const error_message = callbackData.Body.stkCallback.ResultDesc;
      return res.status(400).json({
        ResultCode: result_code,
        ResultDesc: error_message,
      });
    }

    // Extract callback metadata (e.g., Amount, MpesaReceiptNumber, PhoneNumber)
    const body = callbackData.Body.stkCallback.CallbackMetadata;

    const amount = body.Item.find((obj) => obj.Name === "Amount").Value;
    const mpesaCode = body.Item.find(
      (obj) => obj.Name === "MpesaReceiptNumber"
    ).Value;
    const phone = body.Item.find((obj) => obj.Name === "PhoneNumber").Value;

    // Save the transaction data to the database
    const newTransaction = new Transaction({
      amount,
      mpesaCode,
      phoneNumber: phone,
      status: "Completed", // Mark status as completed
    });

    // Save the transaction
    await newTransaction.save();

    // Return success response
    return res.status(200).json({
      message: "Callback processed successfully and transaction saved.",
      transaction: newTransaction,
    });
  } catch (error) {
    console.error("Error processing callback:", error.message);
    return res.status(500).json({
      error: "An error occurred while processing the callback.",
    });
  }
};

// 3. STK Query (Check payment status)
const stkQuery = async (req, res) => {
  try {
    // Get the CheckoutRequestID from the request body
    const { checkoutRequestId } = req.body;
    if (!checkoutRequestId) {
      return res.status(400).json({ error: "CheckoutRequestID is required" });
    }

    // Generate the Timestamp (YYYYMMDDHHMMSS format)
    const timestamp = new Date()
      .toISOString()
      .replace(/[-T:\.Z]/g, "")
      .slice(0, 14);

    // Generate the STK Password
    const password = Buffer.from(
      `${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`
    ).toString("base64");

    // Prepare the Request Body
    const requestBody = {
      BusinessShortCode: process.env.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    // Send the STK Query request to Safaricom API
    const response = await axios.post(
      `${process.env.BASE_URL}/mpesa/stkpushquery/v1/query`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${req.darajaToken}`,
        },
      }
    );

    // Check the response from Safaricom API
    const { ResultCode, ResultDesc } = response.data;
    if (ResultCode === 0) {
      return res.status(200).json({
        message: "Query successful",
        status: "Success",
        result: response.data,
      });
    } else {
      return res.status(400).json({
        message: "Query failed",
        status: "Failure",
        resultCode: ResultCode,
        resultDesc: ResultDesc,
      });
    }
  } catch (error) {
    console.error("Error querying STK payment:", error.message);
    return res.status(500).json({
      error: "An error occurred while querying the STK payment status.",
    });
  }
};

module.exports = {
  sendStkPush,
  handleCallback,
  stkQuery,
};
