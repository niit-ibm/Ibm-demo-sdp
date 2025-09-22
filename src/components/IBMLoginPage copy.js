// src/components/IBMLoginPage.js
import React, { useState } from "react";
import "../App.css"; // reuse app styles

export default function IBMLoginPage({ onBack, onSuccess }) {
  const [step, setStep] = useState("id"); // "id" | "password"
  const [ibmId, setIbmId] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  function handleContinue(e) {
    e.preventDefault();
    if (!ibmId.trim()) return alert("Enter IBMid");
    setStep("password");
  }

  function handleLogin(e) {
    e.preventDefault();
    // fake login — in real app validate credentials
    if (!password) return alert("Enter password");
    if (onSuccess) onSuccess(ibmId);
  }

  return (
    <div className="ibm-login-root">
      <header className="ibm-login-header">
        <div className="ibm-login-inner">
          <div className="ibm-mark">IBM</div>
        </div>
      </header>

      <div className="ibm-login-main">
        <div className="ibm-login-left">
          <h1 className="ibm-login-title">Log in to IBM</h1>

          {step === "id" && (
            <form className="ibm-login-form" onSubmit={handleContinue}>
              <label className="ibm-label">IBMid</label>
              <input
                type="text"
                value={ibmId}
                onChange={(e) => setIbmId(e.target.value)}
                placeholder="Enter your IBMid"
                className="ibm-input"
                autoFocus
              />

              <button className="ibm-continue-btn" type="submit">Continue</button>

              <div className="ibm-remember">
                <label><input type="checkbox" /> Remember me</label>
              </div>

              <div className="ibm-link-block">
                <div>Don't have an account?</div>
                <button className="ibm-create-btn" type="button">Create an IBMid →</button>
              </div>
            </form>
          )}

          {step === "password" && (
            <form className="ibm-login-form" onSubmit={handleLogin}>
              <label className="ibm-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="ibm-input"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="ibm-eye-btn"
                  aria-label="show password"
                >
                  👁
                </button>
              </div>

              <div className="ibm-login-meta">
                Logging in as <strong>{ibmId}</strong>{" "}
                <button
                  type="button"
                  className="ibm-link"
                  onClick={() => setStep("id")}
                >
                  Not you?
                </button>
              </div>

              <button className="ibm-continue-btn" type="submit">Log in</button>

              <div style={{ marginTop: 18 }}>
                <a href="#forgot" onClick={(e) => e.preventDefault()}>Forgot password?</a>
              </div>
            </form>
          )}

          <div style={{ marginTop: 30 }}>
            <button className="ghost-btn" onClick={() => onBack && onBack()}>Back</button>
          </div>
        </div>

        <div className="ibm-login-right" aria-hidden>
          <img src="/sbl-login-art.png" alt="" className="ibm-login-art" />
        </div>
      </div>
    </div>
  );
}
