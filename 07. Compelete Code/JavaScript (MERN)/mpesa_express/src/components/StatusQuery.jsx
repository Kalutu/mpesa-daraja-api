import React, { useState, useEffect } from "react";
import api from "../api";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import Confetti from "react-confetti";

const STKQuery = ({ checkoutRequestID, onRetry }) => {
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const checkSTKStatus = async () => {
      try {
        const response = await api.post("/stk-query", { checkoutRequestID });
        if (response.data.status === "Success") {
          setStatus("success");
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        } else {
          setStatus("failure");
          setErrorMessage(
            response.data.message ||
              "We couldn't complete your payment. Please try again.."
          );
        }
      } catch (error) {
        console.error("Error checking STK status:", error);
        setStatus("failure");
      } finally {
        setLoading(false);
      }
    };

    checkSTKStatus();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        {showConfetti && (
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        )}
        {status === "pending" && (
          <>
            <h2 className="text-lg font-semibold mb-4">
              M-Pesa STK Push sent successfully. Enter your M-Pesa PIN to
              complete the transaction.
            </h2>
            {loading && (
              <div className="flex flex-col items-center">
                <div className="loader animate-spin border-4 border-t-blue-500 border-gray-300 rounded-full w-6 h-6 mb-4"></div>
                <p className="text-gray-600">Waiting for confirmation...</p>
              </div>
            )}
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-2" />
              Payment successful
            </h2>
            <p className="text-gray-600 mb-4">
              Thank you for completing your payment!
            </p>
            <button
              onClick={onRetry}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              OK
            </button>
          </>
        )}

        {status === "failure" && (
          <>
            <h2 className="text-lg font-semibold mb-4 flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-red-500 mr-2" />
              Payment failed
            </h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <button
              onClick={onRetry}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition mr-2"
            >
              Retry Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default STKQuery;
