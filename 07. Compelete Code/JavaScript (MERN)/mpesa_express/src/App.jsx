import React, { useState } from "react";
import PaymentForm from "./components/PaymentForm";
import StatusQuery from "./components/StatusQuery";

const App = () => {
  const [stkPushSent, setSTKPushSent] = useState(false);
  const [checkoutRequestID, setCheckoutRequestID] = useState("");

  const handleSTKPushSuccess = (checkoutRequestID) => {
    setSTKPushSent(true);
    setCheckoutRequestID(checkoutRequestID);
  };
  const retrySTKPush = () => {
    setSTKPushSent(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {stkPushSent ? (
        <StatusQuery
          checkoutRequestID={checkoutRequestID}
          onRetry={retrySTKPush}
        />
      ) : (
        <PaymentForm onSTKPushSuccess={handleSTKPushSuccess} />
      )}
    </div>
  );
};

export default App;
