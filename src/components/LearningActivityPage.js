// src/components/LearningActivityPage.js
import React, { useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

export default function LearningActivityPage({ onBack }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAssessment, setShowAssessment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });
  const [assessmentResult, setAssessmentResult] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setAnswers((s) => ({ ...s, [name]: value }));
  }

  function computeFakeRubrics(answersObj) {
    // simple deterministic scoring from answers: word counts mapped to 1..5
    const rubricNames = [
      "Problem clarity",
      "Design reasoning",
      "Implementation detail",
      "Validation & testing",
      "Reflection quality",
    ];
    const text = `${answersObj.q1}\n${answersObj.q2}\n${answersObj.q3}`.trim();
    const wc = text ? text.split(/\s+/).length : 0;

    // base on per-question lengths for variety
    const lens = [answersObj.q1, answersObj.q2, answersObj.q3].map((t) =>
      t ? t.trim().split(/\s+/).length : 0
    );

    // map lengths to 1-5
    const mapLenToScore = (n) => {
      if (n <= 3) return 1;
      if (n <= 8) return 2;
      if (n <= 18) return 3;
      if (n <= 40) return 4;
      return 5;
    };

    const scores = {};
    scores["Problem clarity"] = mapLenToScore(lens[0] + 1); // q1
    scores["Design reasoning"] = mapLenToScore(Math.round((lens[1] || 0) * 1.1));
    scores["Implementation detail"] = mapLenToScore(lens[2] + Math.floor((lens[1] || 0) / 2));
    // extra rubrics derived from combinations
    scores["Validation & testing"] = mapLenToScore(Math.round((lens[2] + lens[0]) / 2));
    scores["Reflection quality"] = mapLenToScore(Math.round((lens[0] + lens[1] + lens[2]) / 3));

    // combined: average * weight (scale to 20)
    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length; // 1..5
    const combined = Math.round((avg / 5) * 20 * 10) / 10; // out of 20, one decimal
    return { scores, avg, combined, rubricNames };
  }

  const contentRef = useRef(null);
  function handleSubmit(e) {
    e.preventDefault();
    setAssessmentResult(null);
    setSubmitting(true);

    // show spinner + message for ~5s, then compute & show result
    setTimeout(() => {
      const result = computeFakeRubrics(answers);
      setAssessmentResult(result);
      setSubmitting(false);
      // Scroll only inside the main content container
      if (contentRef.current) {
        contentRef.current.scrollTo({
          top: contentRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 8000);
  }

  const progressPreview = useMemo(() => {
    // small preview meta shown in header when not in assessment view
    return {
      duration: "3 hrs 30 mins",
      learners: "18,172",
      rating: "4.6",
    };
  }, []);

  // ------------------------------
  // Activity page logic (new)
  // ------------------------------
  // route matches like /learning/activity/1
  const isActivityPage = location.pathname.startsWith("/learning/activity/");
  const activityId = isActivityPage ? location.pathname.split("/").pop() : null;

  // Activity-specific state: learner submission for this activity
  const [submissionText, setSubmissionText] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [activityResult, setActivityResult] = useState(null);
  const [activityProcessing, setActivityProcessing] = useState(false);
  const PASS_SCORE = 14; // out of 20

  // 🔹 Reset state whenever activityId changes
  React.useEffect(() => {
    if (isActivityPage) {
      setSubmissionText("");
      setAttempts(0);
      setActivityResult(null);
      setActivityProcessing(false);
    }
  }, [activityId, isActivityPage]);



  // A small grader tuned for activity: looks for keywords and length
  function gradeActivity(text) {
    // naive heuristic: base score from length 0..20
    const wc = text.trim() ? text.trim().split(/\s+/).length : 0;
    let base = Math.min(20, Math.round((Math.min(wc, 120) / 120) * 20));

    // keyword checks per activity (lightweight)
    const keywordsByActivity = {
      "1": ["RAG", "retrieval", "vector", "context", "accuracy"],
      "2": ["embedding", "index", "faiss", "annoy", "cosine", "knn"],
      "3": ["prompt", "temperature", "top_p", "filter", "recall", "precision"],
    };
    const kws = keywordsByActivity[activityId] || [];
    let kwMatches = 0;
    const lower = text.toLowerCase();
    kws.forEach((k) => {
      if (lower.includes(k.toLowerCase())) kwMatches += 1;
    });
    // each keyword adds a small bump
    base += Math.min(5, kwMatches * 2);

    // clamp and map to 1..20
    base = Math.max(1, Math.min(20, base));
    // convert into 5-rubric scores roughly
    const rubricScore = Math.round((base / 20) * 5);
    // distribute to five rubrics with some variation
    const scores = {
      "Problem clarity": Math.max(1, Math.min(5, rubricScore + (wc > 30 ? 1 : 0))),
      "Design reasoning": Math.max(1, Math.min(5, rubricScore + (kwMatches >= 1 ? 1 : 0))),
      "Implementation detail": Math.max(1, Math.min(5, rubricScore + (wc > 50 ? 1 : 0))),
      "Validation & testing": Math.max(1, Math.min(5, Math.round(rubricScore - (kwMatches ? 0 : 1)))),
      "Reflection quality": Math.max(1, Math.min(5, Math.round(rubricScore - (wc < 20 ? 1 : 0)))),
    };
    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
    const combined = Math.round((avg / 5) * 20 * 10) / 10;
    return { scores, combined };
  }

  function submitActivity() {
    // simulate AI review cycle
    setActivityProcessing(true);
    setActivityResult(null);
    setTimeout(() => {
      const graded = gradeActivity(submissionText);
      setActivityResult(graded);
      setActivityProcessing(false);
      setAttempts((a) => a + 1);
    }, 2100); // quick simulated review
  }

  function suggestionsFromResult(res) {
    if (!res) return [];
    // find lowest rubric(s)
    const entries = Object.entries(res.scores);
    entries.sort((a, b) => a[1] - b[1]);
    const lowest = entries.slice(0, 2).map((e) => e[0]);

    const suggestions = [];
    lowest.forEach((rubric) => {
      if (rubric === "Problem clarity") {
        suggestions.push("State the problem with explicit goals and measurable success metrics (e.g., latency, accuracy).");
      } else if (rubric === "Design reasoning") {
        suggestions.push("Explain architecture choices and trade-offs; mention RAG vs plain LLM, cost/latency tradeoffs.");
      } else if (rubric === "Implementation detail") {
        suggestions.push("Add concrete implementation notes: libraries, file names, example commands, or pseudo-code.");
      } else if (rubric === "Validation & testing") {
        suggestions.push("Describe how you'd validate: datasets, test counts, metrics (accuracy, latency, MRR).");
      } else if (rubric === "Reflection quality") {
        suggestions.push("Add limitations, next steps, and what you'd measure next—be concise but specific.");
      }
    });
    // de-duplicate
    return Array.from(new Set(suggestions)).slice(0, 4);
  }

  // If the URL is an activity page, render activity UI
  if (isActivityPage) {
    return (
      <div className="learning-root">
        <header className="learning-header">
          <button className="link-btn" onClick={() => navigate("/learning")}>← Back</button>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 13, color: "#666", marginRight: 12 }}>Activity {activityId}</div>
        </header>

        <main style={{ maxWidth: 900, margin: "20px auto", padding: 20 }}>
          <h1 style={{ marginBottom: 6 }}>Activity {activityId}: {activityId === "1" ? "Compare LLM vs RAG outputs" : activityId === "2" ? "Build a tiny RAG pipeline" : "Optimize retrieval & prompting"}</h1>
          <p style={{ color: "#566", marginBottom: 18 }}>
            Try the hands-on exercise below. Submit your short write-up and the system will simulate an AI review, give rubric scores and suggestions. Improve and resubmit until you reach the target score.
          </p>

          <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8 }}>
              <strong>Task</strong>
              <p style={{ margin: "6px 0 0" }}>
                {activityId === "1" && "Provide one example prompt and explain how a RAG-enabled response would differ from a standard LLM response. Mention what retrieval context you'd include."}
                {activityId === "2" && "Describe a minimal RAG pipeline: embedding method, index type, retrieval strategy, and a short command or pseudo-code for embedding an example document."}
                {activityId === "3" && "List three retrieval or prompt changes you'd try to improve accuracy, and why (e.g., change k, use source attribution, tune temperature)."}
              </p>
            </div>

            <label style={{ fontWeight: 700 }}>Your submission (short — 40–150 words recommended)</label>
            <textarea
              rows={6}
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Write your solution here..."
              style={{ width: "100%", padding: 12, borderRadius: 8 }}
            />

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button className="primary-btn" onClick={submitActivity} disabled={activityProcessing}>Submit for AI review</button>
              <button className="ghost-btn" onClick={() => { setSubmissionText(""); setActivityResult(null); setAttempts(0); }}>Reset</button>
              <div style={{ marginLeft: "auto", color: "#666", fontSize: 13 }}>
                Attempts: {attempts}
              </div>
            </div>
          </div>

          {activityProcessing && (
            <div className="assessment-processing" role="status" aria-live="polite">
              <div className="spinner" aria-hidden />
              <div style={{ marginLeft: 12 }}>
                <div style={{ fontWeight: 800 }}>AI is reviewing your submission</div>
                <div style={{ color: "#586", marginTop: 6 }}>Quick automated feedback will appear shortly.</div>
              </div>
            </div>
          )}

          {activityResult && (
            <div style={{ marginTop: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ fontWeight: 900, fontSize: 26 }}>{activityResult.combined} / 20</div>
                <div style={{ color: "#556" }}>Combined score</div>
                <div style={{ marginLeft: "auto" }}>
                  {activityResult.combined >= PASS_SCORE ? (
                    <span style={{ color: "#097a34", fontWeight: 700 }}>Passed ✅</span>
                  ) : (
                    <span style={{ color: "#b45309", fontWeight: 700 }}>Needs improvement</span>
                  )}
                </div>
              </div>

              <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
                {Object.entries(activityResult.scores).map(([k, v]) => (
                  <div key={k} className="rubric-row">
                    <div style={{ fontWeight: 800 }}>{k}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div className="rubric-score">{v} / 5</div>
                      <div className="rubric-bar">
                        <div className="rubric-fill" style={{ width: `${(v / 5) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14 }}>
                <details>
                  <summary style={{ cursor: "pointer", color: "#0b5cff" }}>AI suggestions (click to expand)</summary>
                  <div style={{ marginTop: 8, color: "#333" }}>
                    {suggestionsFromResult(activityResult).map((s, i) => (
                      <p key={i} style={{ marginTop: i === 0 ? 6 : 8 }}>• {s}</p>
                    ))}
                    <p style={{ marginTop: 10, color: "#666" }}>
                      Tip: incorporate at least two suggestions and expand examples or add explicit metrics to increase your score.
                    </p>
                  </div>
                </details>
              </div>

              {activityResult.combined < PASS_SCORE && (
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button className="primary-btn" onClick={() => {
                    // prefill submission with suggested template to help learner
                    let template = submissionText || "";
                    template += "\n\n[Improvements applied: ";
                    const sug = suggestionsFromResult(activityResult);
                    template += sug.slice(0, 2).join("; ") + "]";
                    setSubmissionText(template.trim());
                    // focus area (no actual focus API here — keep UX simple)
                  }}>Apply 2 suggestions (auto-fill)</button>

                  <button className="ghost-btn" onClick={() => { setSubmissionText(submissionText + "\n\nAdded explicit metrics: accuracy 85%, latency 200ms."); }}>Add example metrics</button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    );
  }



  if (showAssessment) {
    // Assessment UI
    return (
      <div className="learning-root">
        <header className="learning-header">
          <div className="ibm-mark">IBM</div>
          <div className="sb-title">SkillsBuild</div>
          <div style={{ flex: 1 }} />
          <button className="link-btn" onClick={() => setShowAssessment(false)}>← Back</button>
        </header>

        <main ref={contentRef} style={{ maxWidth: 1000, margin: "20px auto", padding: "20px", maxHeight: "75vh", overflowY: "auto", }}>
          <h1 style={{ marginBottom: 8 }}>Evidence-based Assessment — Improving LLM Output using Retrieval Augmented Generation</h1>
          <p style={{ color: "#566", marginBottom: 20 }}>
            Answer the prompts below to demonstrate your process and evidence. Provide concise but descriptive answers.
          </p>

          <form onSubmit={handleSubmit} className="assessment-form" aria-label="Assessment form">
            <div className="ass-question">
              <label className="ass-q-label">1. Problem clarity — What problem did you set out to solve? (Describe goals & success metrics)</label>
              <textarea
                name="q1"
                value={answers.q1}
                onChange={handleChange}
                rows={4}
                required
                placeholder="E.g., reduce latency of retrieval from 500ms to 200ms; improve relevance by X%..."
              />
            </div>

            <div className="ass-question">
              <label className="ass-q-label">2. Design reasoning — What architecture/data & tradeoffs did you choose?</label>
              <textarea
                name="q2"
                value={answers.q2}
                onChange={handleChange}
                rows={4}
                required
                placeholder="E.g., used RAG with vector DB for cost vs freshness tradeoff..."
              />
            </div>

            <div className="ass-question">
              <label className="ass-q-label">3. Implementation & validation — Key implementation steps and validation approach (include tests/metrics)</label>
              <textarea
                name="q3"
                value={answers.q3}
                onChange={handleChange}
                rows={4}
                required
                placeholder="E.g., code files, CI, unit tests, evaluation on 200 QA pairs, latency benchmarks..."
              />
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
              <button type="submit" className="primary-btn" disabled={submitting}>
                Submit evidence
              </button>
              <button type="button" className="ghost-btn" onClick={() => { setAnswers({ q1: "", q2: "", q3: "" }); setAssessmentResult(null); }}>
                Reset
              </button>
              <div style={{ marginLeft: "auto", color: "#666", fontSize: 13 }}>
                <strong>Tip:</strong> write ~20–60 words per answer for a stronger assessment.
              </div>
            </div>
          </form>

          {submitting && (
            <div className="assessment-processing" role="status" aria-live="polite">
              <div className="spinner" aria-hidden />
              <div style={{ marginLeft: 12 }}>
                <div style={{ fontWeight: 800 }}>Your submission is reviewed by AI</div>
                <div style={{ color: "#586", marginTop: 6 }}>This typically takes a few seconds — generating scores and feedback.</div>
              </div>
            </div>
          )}

          {assessmentResult && (
            <div className="assessment-result" style={{ marginTop: 20 }}>
              <h2>AI assessment</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 12 }}>
                <div style={{ fontWeight: 900, fontSize: 28 }}>{assessmentResult.combined} / 20</div>
                <div style={{ color: "#556" }}>Overall score (averaged across rubrics)</div>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {Object.entries(assessmentResult.scores).map(([k, v]) => (
                  <div key={k} className="rubric-row">
                    <div style={{ fontWeight: 800 }}>{k}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <div className="rubric-score">{v} / 5</div>
                      <div className="rubric-bar">
                        <div className="rubric-fill" style={{ width: `${(v / 5) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 18 }}>
                <details>
                  <summary style={{ cursor: "pointer", color: "#0b5cff" }}>AI feedback (click to expand)</summary>
                  <div style={{ marginTop: 8, color: "#333" }}>
                    <p><strong>Problem clarity:</strong> The AI looks for explicit goals and measurable success criteria — reinforce with numbers.</p>
                    <p><strong>Design reasoning:</strong> Explain tradeoffs and why each choice was made (cost vs. latency, data freshness).</p>
                    <p><strong>Implementation:</strong> Provide repo links, key filenames and short run instructions to strengthen evidence.</p>
                    <p><strong>Validation:</strong> Include test counts, datasets and numeric results (accuracy, latency, MRR).</p>
                    <p><strong>Reflection:</strong> Mention next steps and limitations.</p>
                  </div>
                </details>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ------------------------------
  // Main (original) learning page
  // ------------------------------
  return (
    <div className="learning-root">
      <header className="learning-header">
        <button className="link-btn" onClick={onBack}>← Back</button>
      </header>

      <div className="learning-hero">
        <div className="learning-meta">
          <h1>Improving LLM Output using Retrieval Augmented Generation</h1>
          <div className="meta-row" style={{ color: "#777", marginTop: 8 }}>
            <span>3 hrs 30 mins</span>
            <span style={{ marginLeft: 12 }}>👥 18,172</span>
            <span style={{ marginLeft: 12 }}>⭐⭐⭐⭐☆ 490</span>
          </div>
          <div className="meta-sub" style={{ marginTop: 8 }}>🔖 In progress • Accessed 14 Aug 2025</div>
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <button className="ghost-btn">Share</button>
        </div>
      </div>

      <main
        className="learning-body"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div className="learning-content">
          <section>
            <h2>About this learning activity</h2>
            <p>
              In this module you will learn practical, hands on ways to improve LLM outputs using Retrieval-Augmented Generation (RAG) and IBM Granite models. The course is organized around three interactive micro-activities that take you from observation to implementation and optimization:
            </p>
            <p>
              Each activity includes in-browser submission and iterative AI feedback so you can refine your work until you reach the passing criteria. Practical tips, sample commands, and short code examples are encouraged to score higher on implementation and validation.
            </p>
          </section>

          <section>
            <h3>What you will learn</h3>
            <ul>

              <li>Compare plain LLM outputs with RAG-augmented outputs to detect hallucinations and measure factual grounding.</li>
              <li>Tune retrieval and prompt strategies (chunk size, top-k, reranking, template design) and measure impact on relevance and accuracy.</li>
              <li>Use IBM Granite to generate, refine, and validate code with grounded context; iterate on feedback and produce testable, production-ready snippets.</li>

            </ul>
          </section>

          <section>
            <h3>Outline</h3>
            <ul>
              <li>
                <a
                  href="#activity-1"
                  onClick={(e) => { e.preventDefault(); navigate("/learning/activity/1"); }}
                  style={{ color: "#0b5cff", textDecoration: "none", animation: "textGlow 2s infinite ease-in-out" }}
                >
                  Activity 1: Compare standard LLM responses with RAG outputs for accuracy improvements
                </a>
              </li>
              <li>
                <a
                  href="#activity-2"
                  onClick={(e) => { e.preventDefault(); navigate("/learning/activity/2"); }}
                  style={{ color: "#0b5cff", textDecoration: "none" }}
                >
                  Activity 2: Build a simple RAG pipeline with embeddings and retrieval.
                </a>
              </li>
              <li>
                <a
                  href="#activity-3"
                  onClick={(e) => { e.preventDefault(); navigate("/learning/activity/3"); }}
                  style={{ color: "#0b5cff", textDecoration: "none" }}
                >
                  Activity 3: Optimize retrieval settings and prompts to improve LLM accuracy.
                </a>
              </li>
            </ul>
          </section>
        </div>

        <aside className="learning-actions">
          <button className="primary-btn">Go to activity</button>
          <button className="ghost-btn">Manage enrollment</button>
          <button
            className="assessment-btn"
            style={{animation: "glowPulse 2s infinite ease-in-out"}}
            onClick={(e) => {
              e.preventDefault();
              navigate("/assessment");
            }}
          >
            Review Assessment
          </button>
          <div className="dropdown">Actions ▾</div>
          {/* <button className="assessment-btn" onClick={() => setShowAssessment(true)}>Review Assessment →</button> */}
          

          <a href="#completed" style={{ color: "#0b5cff", marginTop: 8 }}>
            Completed this activity?
          </a>
        </aside>
      </main>
    </div>
  );
}
