// src/components/LearningActivityPage.js
import React, { useState, useMemo, useRef } from "react";
import "../App.css";

export default function LearningActivityPage({ onBack }) {
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
    scores["Implementation detail"] = mapLenToScore(lens[2] + Math.floor((lens[1] || 0)/2));
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
          <h1 style={{ marginBottom: 8 }}>Evidence-based Assessment — Code Generation and Optimization</h1>
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

  // Main (non-assessment) learning page
  return (
    <div className="learning-root">
      <header className="learning-header">
        <div className="ibm-mark">IBM</div>
        <div className="sb-title">SkillsBuild</div>
        <div style={{ flex: 1 }} />
        <button className="link-btn" onClick={onBack}>← Back</button>
      </header>

      <div className="learning-hero">
        <div className="learning-meta">
          <div className="ibm-card-category">eLearning</div>
          <h1>Code Generation and Optimization Using IBM Granite</h1>
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
              In this module, you will learn how to use IBM Granite models to enhance your coding practices.
              You will explore the key features and purposes of these models, learn how they assist in programming tasks,
              and discover best practices for their effective use.
            </p>
            <p>
              You will also discover some techniques for optimizing AI-generated code, including identifying
              opportunities for improvement, applying specific prompting techniques, and implementing structured workflows.
            </p>
          </section>

          <section>
            <h3>What you’ll learn</h3>
            <ul>
              <li>Use IBM Granite models for code generation and programming tasks</li>
              <li>Optimize AI-generated code using IBM Granite models</li>
            </ul>
          </section>

          <section>
            <h3>Outline</h3>
            {/* <ul>
              <li>Lesson 1: Features of IBM Granite models</li>
              <li>Lesson 2: IBM Granite models and programming tasks</li>
              <li>Lesson 3: Best practices for prompting IBM Granite models</li>
              <li>Lab 1: Use IBM Granite models for code generation and programming tasks</li>
              <li>Lesson 4: Opportunities for optimizing AI-generated code</li>
              <li>Lesson 5: Techniques for code optimization</li>
              <li>Lesson 6: Structured workflows for reviewing and optimizing AI-generated code</li>
              <li>Lab 2: Optimize AI-generated code using IBM Granite models</li>
            </ul> */}
            <ul>
              <li>Activity 1: Compare standard LLM responses with RAG outputs for accuracy improvements </li>
              <li>Activity 2: Build a simple RAG pipeline with embeddings and retrieval.</li>
              <li>Activity 3: Optimize retrieval settings and prompts to improve LLM accuracy.</li>
            </ul>
          </section>
        </div>

        <aside className="learning-actions">
          <button className="primary-btn">Go to activity →</button>
          <button className="ghost-btn">Manage enrollment →</button>
          <div className="dropdown">Actions ▾</div>
          <button className="assessment-btn" onClick={() => setShowAssessment(true)}>Review Assessment →</button>
          <a href="#completed" style={{ color: "#0b5cff", marginTop: 8 }}>
            Completed this activity?
          </a>
        </aside>
      </main>
    </div>
  );
}
