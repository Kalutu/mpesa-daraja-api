import React, { useState } from "react";
import api from "../api";

const PaymentForm = ({ onSTKPushSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhoneNumber = (phone) => {
    const regex = /^(?:\+254|0)?7\d{8}$/;
    if (regex.test(phone)) {
      // Convert to 2547XXXXXXXX format
      if (phone.startsWith("+254")) {
        return phone.slice(1);
      }
      if (phone.startsWith("0")) {
        return `254${phone.slice(1)}`;
      }
      return phone;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    const formattedPhone = validatePhoneNumber(phoneNumber);
    if (!formattedPhone) {
      setError(
        "Invalid Kenyan phone number. Format: 07XXXXXXXX or +2547XXXXXXXX"
      );
      return;
    }

    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount) || numericAmount <= 0 || numericAmount > 250000) {
      setError("Amount must be an integer between 1 and 250,000.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/send-stk-push", {
        phoneNumber: formattedPhone,
        amount: numericAmount,
      });

      if (response.status === 200) {
        onSTKPushSuccess(response.data.checkoutRequestID);
      } else {
        setError(
          response.data?.error ||
            "Failed to initiate payment. Please try again."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
    >
      <h1 className="text-xl font-bold text-gray-800">Payment Form</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="07XXXXXXXX or +2547XXXXXXXX"
          required
        />
      </div>

      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter amount"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center items-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-md shadow-sm ${
          isSubmitting ? "cursor-not-allowed opacity-75" : "hover:bg-indigo-700"
        }`}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          "Pay"
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
