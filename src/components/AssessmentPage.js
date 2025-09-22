// src/components/AssessmentPage.js
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function AssessmentPage({ onBack }) {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [showModal, setShowModal] = useState(false); // 🔹 controls modal visibility

  // NEW: hold uploaded artifact files
  const [artifacts, setArtifacts] = useState(null);
  // NEW: flag if uploaded artifacts contain a known HTML syntax error
  const [artifactError, setArtifactError] = useState(false);

  // scan token to avoid race conditions from stale FileReader callbacks
  const scanTokenRef = useRef(0);

  function handleChange(e) {
    const { name, value } = e.target;
    setAnswers((s) => ({ ...s, [name]: value }));
  }

  // handler for file input - now async and race-safe
  async function handleFileChange(e) {
    const files = e.target.files && e.target.files.length ? e.target.files : null;
    setArtifacts(files);

    // increment token for this scan batch
    const myToken = ++scanTokenRef.current;

    // reset detection state for the new batch immediately
    setArtifactError(false);

    if (!files) return;

    // helper to read a file as text (returns promise)
    const readFileAsText = (file) =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, text: reader.result });
        reader.onerror = () => resolve({ name: file.name, text: null });
        reader.readAsText(file);
      });

    // Only inspect text-like files
    const textLikeFiles = Array.from(files).filter((file) =>
      /\.(html?|htm|txt|js|py|json|md|csv|ipynb|log|xml)$/i.test(file.name)
    );

    if (textLikeFiles.length === 0) {
      // nothing to scan
      return;
    }

    try {
      const readPromises = textLikeFiles.map((f) => readFileAsText(f));
      const results = await Promise.all(readPromises);

      // if a newer scan started, ignore these results
      if (scanTokenRef.current !== myToken) return;

      // simple heuristics for malformed href patterns
      const malformedFound = results.some((r) => {
        if (!r.text || typeof r.text !== "string") return false;
        // detect missing equals in href (e.g., href"page.html") or <a href"...
        const hasMalformedHref = /href"\s*[^>]*>/i.test(r.text) || /<a[^>]*\shref"[^>]*>/i.test(r.text);
        return hasMalformedHref;
      });

      // update state only for the latest scan token
      if (scanTokenRef.current === myToken) {
        setArtifactError(malformedFound);
      }
    } catch (err) {
      // on unexpected error, do not block; keep artifactError false
      console.error("artifact scan failed", err);
      if (scanTokenRef.current === myToken) {
        setArtifactError(false);
      }
    }
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

    // NEW: combined is the SUM of rubric scores (min 5, max 25)
    const sum = Object.values(scores).reduce((a, b) => a + b, 0);

    return { scores, combined: sum };
  }

  // infer activity context from answers using keywords
  function detectActivityContext(answersObj) {
    const text = `${answersObj.q1}\n${answersObj.q2}\n${answersObj.q3}`.toLowerCase();
    // activity 1 keywords (RAG)
    const a1 = ["rag", "retrieval", "vector", "context", "knowledge base", "kb"];
    // activity 2 keywords (embeddings/rag infra)
    const a2 = ["embedding", "faiss", "annoy", "index", "cosine", "knn", "vectorize"];
    // activity 3 keywords (prompt/tuning)
    const a3 = ["prompt", "temperature", "top_p", "top-p", "filter", "recall", "precision", "prompting"];

    const a1Match = a1.some(k => text.includes(k));
    const a2Match = a2.some(k => text.includes(k));
    const a3Match = a3.some(k => text.includes(k));

    if (a1Match && !a2Match && !a3Match) return "activity-1";
    if (a2Match && !a1Match && !a3Match) return "activity-2";
    if (a3Match && !a1Match && !a2Match) return "activity-3";

    // if mixed or none, pick the strongest match by counts
    const counts = {
      "activity-1": a1.reduce((c, k) => c + (text.includes(k) ? 1 : 0), 0),
      "activity-2": a2.reduce((c, k) => c + (text.includes(k) ? 1 : 0), 0),
      "activity-3": a3.reduce((c, k) => c + (text.includes(k) ? 1 : 0), 0),
    };
    const best = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
    return best && best[1] > 0 ? best[0] : "general";
  }

  // Build feedback lines tailored to activity and score-band
  function buildFeedback(activityCtx, scaled20) {
    // scaled20 approx 0..20 — we check for low (<=4), mid, high (>=20)
    const lines = [];

    // helper for activity-specific first-line
    if (activityCtx === "activity-1") {
      lines.push("Context: RAG vs plain LLM — evaluator is checking whether your answer explains retrieval context and grounding.");
    } else if (activityCtx === "activity-2") {
      lines.push("Context: RAG pipeline — evaluator looks for embedding method, index choice and retrieval strategy.");
    } else if (activityCtx === "activity-3") {
      lines.push("Context: Retrieval & prompting — evaluator expects prompt-control, temperature/top_p choices and rationale.");
    } else {
      lines.push("Context: General module assessment — evaluator looks for clear goals, reasoning and validation.");
    }

    // Now add banded suggestions
    if (scaled20 <= 4) {
      // very low (like 4/20)
      lines.push("Summary: Your submission is very brief and lacks concrete examples or metrics.");
      if (activityCtx === "activity-1") {
        lines.push("Actionable: Add a short example prompt and list 2–3 documents or fields you would retrieve to ground the answer (e.g., product spec, API docs).");
      } else if (activityCtx === "activity-2") {
        lines.push("Actionable: Specify an embedding model, the type of index (e.g., FAISS flat or HNSW), and a single example command/pseudo-code for creating embeddings.");
      } else if (activityCtx === "activity-3") {
        lines.push("Actionable: Show at least one alternative prompt and a note on temperature/top_p settings you would try and why.");
      } else {
        lines.push("Actionable: Expand each answer to include goals, how you'll measure success, and one concrete example.");
      }
      lines.push("Quick wins: add explicit metrics (e.g., latency, accuracy), include sample commands or one small example snippet.");
    } else if (scaled20 >= 20) {
      // very high (like 20/20)
      lines.push("Summary: Excellent — your submission is detailed, grounded, and includes measurable criteria.");
      if (activityCtx === "activity-1") {
        lines.push("Praise: You clearly described retrieval context and how it reduces hallucination; include a short retrieval example or snippet if available.");
      } else if (activityCtx === "activity-2") {
        lines.push("Praise: Good choice of embedding/index rationale. Consider adding a note on approximate vs exact search tradeoffs and resource implications.");
      } else if (activityCtx === "activity-3") {
        lines.push("Praise: Strong prompt strategy and control parameters. Consider documenting A/B prompts and which metrics you'll compare.");
      } else {
        lines.push("Praise: Clear goals and validation plan; consider adding references or next-step experiments.");
      }
      lines.push("Next steps: add references, commands, or a short validation table (e.g., dataset size, metric values) to make this production-ready.");
    } else {
      // middle band
      lines.push("Summary: Solid start — some areas need more detail or grounding.");
      if (activityCtx === "activity-1") {
        lines.push("Improve: Make the 'RAG' benefits explicit by naming what types of documents you'd retrieve and how they change the answer.");
      } else if (activityCtx === "activity-2") {
        lines.push("Improve: Add more implementation detail (which embedding model, how to index, retrieval parameters such as k).");
      } else if (activityCtx === "activity-3") {
        lines.push("Improve: Give concrete prompt examples and explain why you would alter temperature/top_p or k for retrieval.");
      } else {
        lines.push("Improve: Expand one example, include one measurable success criterion, and explain how you'd validate.");
      }
      lines.push("Tip: enrich one answer with a short code snippet or explicit metric to push your score higher.");
    }

    return lines;
  }

  function getTipText(scaled20, activityCtx) {
    if (scaled20 <= 4) {
      if (activityCtx === "activity-1") return "Tip: Add a sample prompt + list of documents to retrieve (e.g., 'product-guide', 'API-spec').";
      if (activityCtx === "activity-2") return "Tip: Name an embedding model and index (e.g., 'sentence-transformers' + FAISS).";
      if (activityCtx === "activity-3") return "Tip: Provide a prompt variant and a temp/top_p setting to try.";
      return "Tip: Expand answers with concrete examples and measurable goals.";
    }
    if (scaled20 >= 20) {
      return "Tip: Great work — add references or a short validation table to make this production-ready.";
    }
    // mid band
    return "Tip: Strengthen one answer with an example or explicit metric (accuracy, latency) to increase your score.";
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

  // helper to compute scaled 20-point score for conditional messaging
  function scaledTo20(combined25) {
    // protect against null/undefined
    if (combined25 == null) return null;
    return Math.round((combined25 / 25) * 20);
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
        <h1>Evidence-based Assessment : Improving LLM Output using Retrieval Augmented Generation</h1>
        <p style={{ color: "#566", marginBottom: 20 }}>
          Answer the prompts below to demonstrate your process and evidence.
          Provide concise but descriptive answers.
        </p>

        <form onSubmit={handleSubmit} className="assessment-form">
          <label>
            1. Problem clarity{" "}
            <span style={{ color: "#666", fontWeight: 400 }}>
              [Briefly describe the AI/RAG problem you are addressing - what question or use case you want the system to answer, why plain LLM may fail (e.g., hallucination, outdated info), and what success looks like (e.g., retrieval improves factual accuracy to 90%, latency &lt;300ms).]
            </span>
          </label>
          <textarea
            name="q1"
            value={answers.q1}
            onChange={handleChange}
            rows={4}
            required
          />
          <label>
            2. Design reasoning{" "}
            <span style={{ color: "#666", fontWeight: 400 }}>
              [Describe architecture choices, trade-offs, and why you chose them (e.g., embedding model, index type, retrieval strategy)]
            </span>
          </label>
          <textarea
            name="q2"
            value={answers.q2}
            onChange={handleChange}
            rows={4}
            required
          />
          <label>
            3. Implementation & validation{" "}
            <span style={{ color: "#666", fontWeight: 400 }}>
              [List key implementation steps, tests/datasets used, and metrics (accuracy, latency, MRR). Include sample commands or file names when possible]
            </span>
          </label>
          <textarea
            name="q3"
            value={answers.q3}
            onChange={handleChange}
            rows={4}
            required
          />

          {/* NEW: artifact upload field */}
          <label>
            4. Upload artifacts (optional){" "}
            <span style={{ color: "#666", fontWeight: 400 }}>
              [Attach code, dataset samples, logs, or a ZIP of your project — accepted: .zip, .py, .ipynb, .csv, .pdf (multiple files allowed)]
            </span>
          </label>
          <input
            type="file"
            name="artifacts"
            onChange={handleFileChange}
            multiple
            accept=".zip,.py,.ipynb,.csv,.json,.pdf,.txt,.html,.htm,.js,.py,.md"
            style={{ display: "block", marginBottom: 12 }}
          />
          {artifacts && (
            <div style={{ color: "#333", fontSize: 13, marginBottom: 8 }}>
              Files ready to upload:{" "}
              <strong>
                {Array.from(artifacts)
                  .map((f) => f.name)
                  .join(", ")}
              </strong>
            </div>
          )}

          <button type="submit" className="primary-btn" style={{animation: "glowPulse 2s infinite ease-in-out"}} disabled={submitting}>
            Submit Evidence
          </button>
        </form>
      </main>
     
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
            style={{ width: "760px", maxWidth: "94vw" }}   /* <-- widened modal here */
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
                <h2 style={{textAlign:"center"}}>AI Assessment</h2>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    marginBottom: 12,
                  }}
                >
                  <div style={{ fontWeight: 900, fontSize: 28 }}>
                    {/* show out of 25 */}
                    {assessmentResult.combined} / 25
                  </div>
                  <div style={{ color: "#556" }}>
                    Overall score (sum of rubric scores)
                  </div>
                </div>

                {/* dynamic Tip based on score band and detected activity */}
                <div style={{ marginBottom: 12, display: "flex", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, marginRight: 12 }}>Tip:</div>
                  <div style={{ color: "#0b5cff" }}>
                    {getTipText(scaledTo20(assessmentResult.combined), detectActivityContext(answers))}
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

                <div style={{ marginTop: 18 }}>
                  <details>
                    <summary style={{ cursor: "pointer", color: "#0b5cff" }}>AI feedback (click to expand)</summary>
                    <div style={{ marginTop: 8, color: "#333" }}>
                      {(() => {
                        // build and render feedback lines
                        try {
                          // If artifactError detected, show the requested error message here
                          // BUT keep and render the original feedback lines below it.
                          const parts = [];

                          if (artifactError) {
                            parts.push(
                              <p key="artifact-error" style={{ marginTop: 6, color: "#a00" }}>
                                Unable to generate detailed AI feedback for this submission. Please check uploaded files (malformed HTML found) and try again.
                              </p>
                            );
                          }

                          const ctx = detectActivityContext(answers);
                          const banded = buildFeedback(ctx, scaledTo20(assessmentResult.combined));
                          const feedbackNodes = banded.map((line, i) => (
                            <p key={`fb-${i}`} style={{ marginTop: i === 0 ? 6 : 8 }}>
                              {line}
                            </p>
                          ));

                          return [...parts, ...feedbackNodes];
                        } catch (err) {
                          // swallow rendering errors caused by unexpected input (e.g., malformed pasted files)
                          // show a brief, user-friendly fallback message — once user fixes the error and reuploads, this will not appear.
                          console.error("Error generating AI feedback:", err);
                          return <p style={{ marginTop: 6, color: "#a00" }}>Unable to generate detailed AI feedback for this submission. Please check uploaded files or pasted content and try again.</p>;
                        }
                      })()}
                    </div>
                  </details>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
