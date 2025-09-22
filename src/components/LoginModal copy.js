// src/components/LoginModal.js
import React, { useEffect } from "react";

export default function LoginModal({ open, onClose, onSelectRole }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="sb-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="sb-login-title" onClick={onClose}>
      <div className="sb-modal" onClick={(e) => e.stopPropagation()}>
        <button className="sb-modal-close" aria-label="Close login" onClick={onClose}>✕</button>

        <header className="sb-modal-header">
          <div>
            <h2 id="sb-login-title">Log in</h2>
            <div className="sb-signup">
              Don’t have an account? <a href="#signup" onClick={(e) => e.preventDefault()}>Sign up</a>
            </div>
          </div>
        </header>

        <div className="sb-modal-divider" />

        <div className="sb-modal-body">
          <section className="sb-section">
            <h3 className="sb-section-title">Log in as a:</h3>
          </section>

          <div className="sb-section">
            <div className="sb-role-group-title">High school student or high school educator</div>
            <div className="sb-roles-grid">
              <button className="sb-role-card" onClick={() => onSelectRole && onSelectRole("high_school_student")}>
                <div className="sb-role-label">High school student</div>
              </button>

              <button className="sb-role-card" onClick={() => onSelectRole && onSelectRole("high_school_educator")}>
                <div className="sb-role-label">High school educator</div>
              </button>
            </div>
          </div>

          <div className="sb-section">
            <div className="sb-hr" />
          </div>

          <div className="sb-section">
            <div className="sb-role-group-title">College student or college educator</div>
            <div style={{ display: "flex", gap: 12 }}>
              <input className="sb-input" placeholder="College skills program" />
              <input className="sb-input" placeholder="College software downloads" />
            </div>
          </div>

          <div className="sb-section">
            <div className="sb-hr" />
          </div>

          <div className="sb-section">
            <div className="sb-role-group-title">Adult learner or supporting organization</div>
            <div>
              <button
                className="sb-role-card sb-role-large selected"
                onClick={() => onSelectRole && onSelectRole("adult_learner")}
              >
                <div className="sb-role-label">Adult learner</div>
                <div className="sb-role-checked">✔</div>
              </button>
            </div>
          </div>
        </div>

        <footer className="sb-modal-footer">
          <button className="sb-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="sb-btn-login" onClick={() => onSelectRole && onSelectRole("proceed_login")}>Log in</button>
        </footer>
      </div>
    </div>
  );
}
