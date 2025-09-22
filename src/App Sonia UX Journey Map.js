// src/App.js
import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import LoginModal from "./components/LoginModal";
import IBMLoginPage from "./components/IBMLoginPage";
import ResumeLanding from "./components/ResumeLanding";
import LearningActivityPage from "./components/LearningActivityPage";
import AssessmentPage from "./components/AssessmentPage";

function AppLayout({ signedInIbmId, setSignedInIbmId }) {
  const navigate = useNavigate();
  const location = useLocation();

  const loginOpen = location.pathname === "/login";

  function handleSelectRole(role) {
    if (!role) return;
    navigate(-1);
  }

  function handleProceedLogin() {
    navigate("/ibm-login");
  }

  function handleLoginSuccess(ibmId) {
    setSignedInIbmId(ibmId || "");
    navigate("/resume");
  }

  return (
    <div className="sb-root">
      <LoginModal
        open={loginOpen}
        onClose={() => navigate(-1)}
        onSelectRole={(roleOrAction) => {
          if (roleOrAction === "proceed_login") handleProceedLogin();
          else handleSelectRole(roleOrAction);
        }}
      />

      <header className="sb-header">
        <div className="sb-header-inner">
          <div className="sb-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <div className="ibm-mark">IBM</div>
            <div className="sb-title">SkillsBuild</div>
          </div>

          <nav className="sb-nav">
            <ul>
              <li onClick={() => navigate("/")}>Learn</li>
              <li>Educators</li>
              <li>Organizations</li>
              <li>Spotlights</li>
              <li>Events</li>
            </ul>
          </nav>

          <div className="sb-actions">
            <button onClick={() => navigate("/login")} className="link-btn" style={{animation: "glowPulse 2s infinite ease-in-out"}}>Log in</button>
            <button className="primary-btn" onClick={() => navigate("/signup")}>Sign up</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default function App() {
  const [signedInIbmId, setSignedInIbmId] = useState("");

  return (
    <>
      <AppLayout signedInIbmId={signedInIbmId} setSignedInIbmId={setSignedInIbmId} />

      <Routes>
        <Route
          path="/"
          element={
            <main className="sb-hero-wrap">
              <section className="sb-hero">
                <div className="sb-hero-left">
                  <h1 className="sb-hero-kicker">IBM SkillsBuild</h1>
                  <h2 className="sb-hero-title">Power your future in tech with job skills, courses, and credentials—for free.</h2>
                  <p className="sb-hero-sub">
                    Short modules, curated programs and digital credentials to help you gain real job skills.
                  </p>

                  <div className="sb-hero-ctas">
                    <button className="primary-btn large" onClick={() => window.location.assign("/resume")}>Get started</button>
                    <button className="ghost-btn large">Explore learning</button>
                  </div>
                </div>

                <div className="sb-hero-right" aria-hidden>
                  <img src="/sblanding.png" alt="SkillsBuild hero" className="hero-image" />
                </div>
              </section>
            </main>
          }
        />

        <Route
          path="/ibm-login"
          element={<IBMLoginPage onBack={() => window.history.back()} onSuccess={(ibmId) => { setSignedInIbmId(ibmId); window.location.assign("/resume"); }} />}
        />

        <Route
          path="/resume"
          element={<ResumeLanding ibmId={signedInIbmId} onSignOut={() => { setSignedInIbmId(""); window.location.assign("/"); }} onOpenActivity={() => window.location.assign("/learning")} />}
        />

        <Route path="/learning" element={<LearningActivityPage onBack={() => window.location.assign("/resume")} />} />
        <Route path="/assessment" element={<AssessmentPage onBack={() => window.history.back()} />} />
        <Route path="/login" element={<div />} />
        <Route path="*" element={<div style={{ padding: 40 }}>Page not found — <button onClick={() => window.location.assign("/")}>Go home</button></div>} />
        <Route path="/learning/activity/:id" element={<LearningActivityPage onBack={() => window.location.assign("/learning")} />} />
      </Routes>
    </>
  );
}
