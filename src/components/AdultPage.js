import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function AdultPage(){
  const navigate = useNavigate();

  return (
    <div className="page full-page">
      <header className="sb-header">
        <div className="sb-header-inner">
          <div className="sb-logo">
            <div className="ibm-mark">IBM</div>
            <div className="sb-title">SkillsBuild</div>
          </div>
          <nav className="sb-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
            </ul>
          </nav>
          <div className="sb-actions">
            <button className="link-btn" onClick={() => navigate("/ibm-login")}>Log in</button>
          </div>
        </div>
      </header>

      <main className="center-card">
        <div className="card large">
          <h1>You're signing in as an <span className="accent">Adult learner</span></h1>
          <p className="muted">This path shows content tailored for adult learners — short micro-modules, case studies and career supports.</p>

          <div style={{display:"flex", gap:12, marginTop:18}}>
            <button className="primary-btn" onClick={() => navigate("/ibm-login")}>Proceed to IBM login</button>
            <button className="ghost-btn" onClick={() => navigate("/")}>Back to home</button>
          </div>
        </div>
      </main>

      <footer className="sb-footer">© Demo — IBM SkillsBuild style (mock)</footer>
    </div>
  );
}
