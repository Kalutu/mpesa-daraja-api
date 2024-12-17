const express = require("express");
const router = express.Router();

// Import middleware and controllers
const darajaAuthMiddleware = require("../middlewares/darajaAuthMiddleware");
const {
  sendStkPush,
  handleCallback,
  stkQuery,
} = require("../controllers/paymentController");

// Route 1: Send STK Push (Initiate payment request)
router.post("/send-stk-push", darajaAuthMiddleware, sendStkPush);

// Route 2: Handle Callback from M-Pesa
router.post("/callback", handleCallback);

// Route 3: STK Query (Query the status of a payment)
router.post("/stk-query", darajaAuthMiddleware, stkQuery);

module.exports = router;
