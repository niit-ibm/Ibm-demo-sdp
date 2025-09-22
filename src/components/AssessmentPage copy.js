// src/components/AssessmentPage.js
import React, { useState } from "react";
import "../App.css";

export default function AssessmentPage({ onBack }) {
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [showModal, setShowModal] = useState(false); // 🔹 controls modal visibility

  function handleChange(e) {
    const { name, value } = e.target;
    setAnswers((s) => ({ ...s, [name]: value }));
  }

  function computeFakeRubrics(answersObj) {
    const mapLenToScore = (n) => {
      if (n <= 3) return 1;
      if (n <= 8) return 2;
      if (n <= 18) return 3;
      if (n <= 40) return 4;
      return 5;
    };

    const lens = [answersObj.q1, answersObj.q2, answersObj.q3].map((t) =>
      t ? t.trim().split(/\s+/).length : 0
    );

    const scores = {};
    scores["Problem clarity"] = mapLenToScore(lens[0]);
    scores["Design reasoning"] = mapLenToScore(lens[1]);
    scores["Implementation detail"] = mapLenToScore(lens[2]);
    scores["Validation & testing"] = mapLenToScore(
      Math.round((lens[0] + lens[2]) / 2)
    );
    scores["Reflection quality"] = mapLenToScore(
      Math.round((lens[0] + lens[1] + lens[2]) / 3)
    );

    const avg =
      Object.values(scores).reduce((a, b) => a + b, 0) /
      Object.values(scores).length;
    const combined = Math.round((avg / 5) * 20 * 10) / 10;

    return { scores, combined };
  }

  function handleSubmit(e) {
    e.preventDefault();
    setAssessmentResult(null);
    setSubmitting(true);
    setShowModal(true); // 🔹 open modal immediately after submit

    setTimeout(() => {
      const result = computeFakeRubrics(answers);
      setAssessmentResult(result);
      setSubmitting(false);
    }, 5000);
  }

  return (
    <div className="assessment-root">
      <header className="learning-header">
        <div className="ibm-mark">IBM</div>
        <div className="sb-title">SkillsBuild</div>
        <div style={{ flex: 1 }} />
        <button className="link-btn" onClick={onBack}>
          ← Back
        </button>
      </header>

      <main style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
        <h1>Evidence-based Assessment — Code Generation and Optimization</h1>
        <p style={{ color: "#566", marginBottom: 20 }}>
          Answer the prompts below to demonstrate your process and evidence.
          Provide concise but descriptive answers.
        </p>

        <form onSubmit={handleSubmit} className="assessment-form">
          <label>1. Problem clarity</label>
          <textarea
            name="q1"
            value={answers.q1}
            onChange={handleChange}
            rows={4}
            required
          />
          <label>2. Design reasoning</label>
          <textarea
            name="q2"
            value={answers.q2}
            onChange={handleChange}
            rows={4}
            required
          />
          <label>3. Implementation & validation</label>
          <textarea
            name="q3"
            value={answers.q3}
            onChange={handleChange}
            rows={4}
            required
          />
          <button type="submit" className="primary-btn" disabled={submitting}>
            Submit evidence
          </button>
        </form>
      </main>
     SHOWOOOO {JSON.stringify(showModal)}

      {/* 🔹 Popup Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            // setShowModal(false);
            setAssessmentResult(null);
            setSubmitting(false);
          }}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()} // prevent close on inner click
          >
            <button
              className="modal-close"
              onClick={() => {
                setShowModal(false);
                setAssessmentResult(null);
                setSubmitting(false);
              }}
            >
              ✕
            </button>

            {submitting && (
              <div className="assessment-processing">
                <div className="spinner" aria-hidden />
                <div style={{ marginLeft: 12 }}>
                  <div style={{ fontWeight: 800 }}>
                    Your submission is reviewed by AI
                  </div>
                  <div style={{ color: "#586", marginTop: 6 }}>
                    This typically takes a few seconds — generating scores and
                    feedback.
                  </div>
                </div>
              </div>
            )}

            {assessmentResult && (
              <div className="assessment-result">
                <h2>AI assessment</h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 28 }}>
                    {assessmentResult.combined} / 20
                  </div>
                  <div style={{ color: "#556" }}>
                    Overall score (averaged across rubrics)
                  </div>
                </div>
                {Object.entries(assessmentResult.scores).map(([k, v]) => (
                  <div key={k} className="rubric-row">
                    <div style={{ fontWeight: 800 }}>{k}</div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <div className="rubric-score">{v} / 5</div>
                      <div className="rubric-bar">
                        <div
                          className="rubric-fill"
                          style={{ width: `${(v / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
