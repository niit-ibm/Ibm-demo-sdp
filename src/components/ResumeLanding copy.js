// src/components/ResumeLanding.js
import React from "react";
import "../App.css";

export default function ResumeLanding({ ibmId, onSignOut, onOpenActivity }) {
  // helper to make the card keyboard accessible
  const handleCardKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpenActivity && onOpenActivity();
    }
  };

  return (
    <div className="resume-root">
      <div style={{ maxWidth: 1200, margin: "18px auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
          <div style={{ fontWeight: 700 }}>{ibmId || ""}</div>
          {ibmId && (
            <button className="link-btn small" onClick={() => onSignOut && onSignOut()}>
              Sign out
            </button>
          )}
        </div>
      </div>

      <div className="resume-hero" role="region" aria-label="What will you learn today">
        <div className="resume-hero-left">
          <h1>What will you learn today?</h1>
          <div className="search-box">
            <input placeholder="Search learning" aria-label="Search learning" />
          </div>
          <div className="resume-stats" aria-hidden="false">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="circle" aria-hidden>1</div>
              <div style={{ color: "#fff", marginRight: 18 }}>Learning hours completed</div>
              <div className="circle" aria-hidden>0</div>
              <div style={{ color: "#fff" }}>Digital credentials earned</div>
            </div>
          </div>
        </div>
        <div className="resume-hero-right">
          <img src="/sblanding.png" alt="Hero decorative" style={{ width: "100%", maxWidth: 700, borderRadius: 8 }} />
        </div>
      </div>

      <section style={{ padding: "28px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ color: "#2c4aa0", marginBottom: 12 }}>Resume learning</h2>

        <div className="resume-cards" role="list">
          {/* Single styled clickable card */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Open learning activity: Code Generation and Optimization Using IBM Granite"
            className="ibm-card clickable-card"
            onClick={() => onOpenActivity && onOpenActivity()}
            onKeyDown={handleCardKey}
            style={{ cursor: "pointer" }}
          >
            <div className="ibm-card-thumb" aria-hidden>
              <img src="/thumb-codegen.png" alt="" />
            </div>

            <div className="ibm-card-body">
              <div className="ibm-card-category">eLearning</div>

              <div
                className="ibm-card-title"
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: "#15213a",
                }}
              >
                Code Generation and Optimization Using IBM Granite
              </div>

              <div className="ibm-card-sub" style={{ marginTop: 8, color: "#64748b", fontSize: 13 }}>
                3 hrs 30 mins
              </div>

              <div className="ibm-card-status" style={{ marginTop: 10, color: "#475569", fontSize: 13 }}>
                <span className="bookmark" aria-hidden>🔖</span> In progress
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
