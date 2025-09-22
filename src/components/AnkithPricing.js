import React from "react";
import "./AnkithPricing.css";

const AnkithPricing = ({ title, tier, price, buttonText, features, onButtonClick }) => {
  return (
    <div className="pricing-card">
      <h3 className="tier-title">{title}</h3>
      <p className="tier-subtitle">{tier}</p>
      <h2 className="price">
        {price !== "Contact Sales" ? `₹${price} INR` : "Contact Sales"}
      </h2>
      {price !== "Contact Sales" && (
        <p className="per-user">per user/month</p>
      )}
      <button onClick={onButtonClick} className="pricing-btn">
        {buttonText}
      </button>
      <div className="features">
        {features.map((f, i) => (
          <details key={i}>
            <summary>{f}</summary>
          </details>
        ))}
      </div>
    </div>
  );
};

export default AnkithPricing;
