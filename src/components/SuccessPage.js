import React from "react";
import { useLocation } from "react-router-dom";

function SuccessPage() {
  const location = useLocation();
  const { phone, email } = location.state || {};

  return (
    <div className="success-container">
      <h2>Registration Successful</h2>
      <p>
        User with phone: <strong>{phone}</strong> and email: <strong>{email}</strong> has been registered.
      </p>
    </div>
  );
}

export default SuccessPage;