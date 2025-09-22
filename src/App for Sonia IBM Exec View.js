
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";


const MODULES = {
  "SB-UX101": { id: "SB-UX101", title: "Conversational UX Foundations", lane: "UX & AI", desc: "Intro to designing conversational flows, intents, and evaluation metrics.", link: "#" },
  "SB-AUDIO20": { id: "SB-AUDIO20", title: "Text-to-Speech with Watson", lane: "Multimodal", desc: "Hands-on TTS with Watson APIs and accessibility use-cases.", link: "#" },
  "SB-ML01": { id: "SB-ML01", title: "Intro to Machine Learning", lane: "ML Basics", desc: "Core ML concepts, model selection and evaluation.", link: "#" },
  "SB-CODE-ADV": { id: "SB-CODE-ADV", title: "Advanced Code Gen & Tooling", lane: "Engineering", desc: "Code generation at scale and CI/CD for ML systems.", link: "#" },
  "SB-NLP-01": { id: "SB-NLP-01", title: "NLP Summarization Basics", lane: "NLP", desc: "Summarization and evaluation techniques.", link: "#" },
  "SB-LLM-BASICS": { id: "SB-LLM-BASICS", title: "Large Language Models - Primer", lane: "LLM", desc: "What LLMs are and where to use them ethically.", link: "#" },
  "SB-AGENT-LRN": { id: "SB-AGENT-LRN", title: "Build AI Agents", lane: "Agents", desc: "Build, test and iterate AI agents using RAG patterns.", link: "#" },
  "SB-EMBED01": { id: "SB-EMBED01", title: "Embeddings Fundamentals", lane: "Retrieval", desc: "Vector embeddings, similarity search and retrieval.", link: "#" },
  "SB-HEALTH-01": { id: "SB-HEALTH-01", title: "AI in Healthcare — Intro", lane: "Domain", desc: "Clinical workflows, safety and data privacy considerations.", link: "#" },
  // "SB-DIGILIT-01": { id: "SB-DIGILIT-01", title: "Digital Literacy", lane: "Domain", desc: "Digital literacy, tools, communication, security, collaboration.", link: "#" },
  // "SB-AILIT-01": { id: "SB-AILIT-01", title: "AI Literacy", lane: "Domain", desc: "Understanding AI concepts, tools, and ethical considerations.", link: "#" },
  // "SB-AIFUND-01": { id: "SB-AIFUND-01", title: "AI Fundamentals", lane: "Domain", desc: "Foundational concepts and applications of AI.", link: "#" }
};


const COURSES = [
  { id: 1, title: "Build Your First Chatbot", tier: "Explore", duration: 1.5, personas: ["Student Developers"], complements: "SB-UX101", microModule: true },
  { id: 2, title: "Explore Text to Speech using IBM Watson", tier: "Explore", duration: 1.5, personas: ["Student Developers"], complements: "SB-AUDIO20", microModule: false },
  { id: 3, title: "Generative AI in Software Development", tier: "Explore", duration: 1.5, personas: ["AI/Tech Professionals"], complements: "SB-ML01", microModule: true },
  { id: 4, title: "IBM Granite Models for Software Development", tier: "Explore", duration: 1.5, personas: ["AI/Tech Professionals"], complements: "New", microModule: true },
  { id: 5, title: "Code Generation and Optimization Using IBM", tier: "Learn", duration: 4, personas: ["AI/Tech Professionals"], complements: "SB-CODE-ADV", microModule: true },
  { id: 6, title: "Summarizing Data using IBM Granite", tier: "Explore", duration: 1.5, personas: ["AI/Tech Professionals"], complements: "SB-NLP-01", microModule: false },
  { id: 7, title: "Classifying Data using IBM Granite", tier: "Explore", duration: 1.5, personas: ["AI/Tech Professionals"], complements: "SB-NLP-01", microModule: false },
  { id: 8, title: "Data Classification and Summarization using IBM Granite", tier: "Learn", duration: 4, personas: ["AI/Tech Professionals"], complements: "SB-NLP-01", microModule: true },
  { id: 9, title: "Introduction to Large Language Models", tier: "Explore", duration: 1.5, personas: ["AI/Tech Professionals", "Student Developers"], complements: "SB-LLM-BASICS", microModule: true },
  { id: 10, title: "Generative AI Ethics", tier: "Explore", duration: 0.25, personas: ["Non-Technical Adult Learners", "AI/Tech Professionals"], complements: "SB-ETH01", microModule: false },
  { id: 11, title: "SDI Video", tier: "Video", duration: 0.25, personas: ["Non-Technical Adult Learners"], complements: "SB-VIDEO-INTRO", microModule: false },
  { id: 12, title: "Unleashing the Power of AI Agents", tier: "Explore", duration: 1.5, personas: ["AI/Tech Professionals"], complements: "SB-AGENT-LRN", microModule: true },
  { id: 13, title: "Introduction to Retrieval Augmented Generation (RAG)", tier: "Explore", duration: 1.5, personas: ["AI/Tech Professionals"], complements: "SB-EMBED01", microModule: true },
  { id: 14, title: "Multiagent Systems and the Future of AI", tier: "Explore", duration: 1.5, personas: ["Non-Technical Adult Learners", "AI/Tech Professionals"], complements: "New", microModule: false },
  { id: 15, title: "Vector Embeddings: AI's Key to Meaning", tier: "Explore", duration: 1.5, personas: ["AI/Tech Professionals"], complements: "SB-EMBED01", microModule: true },
  { id: 16, title: "Build an AI Agent", tier: "Learn", duration: 4, personas: ["Student Developers", "AI/Tech Professionals"], complements: "SB-AGENT-LRN", microModule: true },
  { id: 17, title: "Build \"Smarter\" AI with Text and Image Embeddings", tier: "Learn", duration: 4, personas: ["AI/Tech Professionals"], complements: "SB-EMBED01", microModule: true },
  { id: 18, title: "Improving LLM Output using Retrieval Augmented Generation", tier: "Learn", duration: 4, personas: ["AI/Tech Professionals"], complements: "SB-EMBED01", microModule: true },
  { id: 19, title: "Game Changer: AI's Impact on Professional Sports", tier: "Explore", duration: 1.5, personas: ["Non-Technical Adult Learners"], complements: "SB-SPORTS-INTRO", microModule: false },
  { id: 20, title: "AI in Healthcare", tier: "Explore", duration: 1.5, personas: ["Non-Technical Adult Learners"], complements: "SB-HEALTH-01", microModule: true },
  { id: 21, title: "AI in Legal", tier: "Explore", duration: 1.5, personas: ["Non-Technical Adult Learners"], complements: "SB-LEGAL-01", microModule: false },
  { id: 22, title: "Multimodal RAG for Images, Audio & Video", tier: "Explore", duration: 1.5, personas: ["AI/Tech Professionals"], complements: "New", microModule: true },
  // { id: 23, title: "Digital Literacy", tier: "Learn", duration: 4, personas: ["Non-Technical Adult Learners"], complements: "SB-DIGILIT-01", microModule: true },
  // { id: 24, title: "AI Literacy", tier: "Learn", duration: 4, personas: ["Non-Technical Adult Learners"], complements: "SB-AILIT-01", microModule: true },
  // { id: 25, title: "AI Fundamentals", tier: "Learn", duration: 10, personas: ["Non-Technical Adult Learners"], complements: "SB-AIFUND-01", microModule: true }
];

const TIERS = ["Explore", "Learn", "Video"];
const PERSONAS = ["Student Developers", "AI/Tech Professionals", "Non-Technical Adult Learners"];


const injectStyles = () => {
  const css = `
  :root{
    --bg-1:#f0f7ff; --bg-2:#fbf7ff; --card:#ffffff; --muted:#6b7280;
    --accent-A:#0066ff; --accent-B:#8b5cf6; --accent-C:#06b6d4;
    --chip-bg: rgba(11,22,65,0.06);
    --evidence-bg: #f6fbff;
    --strategy-bg: #f9fbf6;
    --personas-bg: #fff9fb;
    --gaps-bg: #fffaf6;
    --reco-bg: #f7faff;
  }
  *{box-sizing:border-box;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial;}
  html,body,#root{height:100%;margin:0;padding:0;background:linear-gradient(180deg,var(--bg-1),var(--bg-2));}
  .app-wrap{padding:32px 20px;display:flex;justify-content:center;align-items:flex-start;}
  .container{
    width:100%;
    max-width:1220px;
    min-width:980px;
    height: calc(100vh - 96px);
    background: linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.99));
    border-radius:16px;
    padding:24px;
    box-shadow:0 18px 50px rgba(12,16,30,0.07);
    border:1px solid rgba(11,22,65,0.04);
    overflow-y: auto;
    overflow-x: hidden;
  }
  /* FIXED inner tab width so content width is consistent */
  .tab-content {
    width: 100%;
    max-width: 980px;   /* fixed inner width */
    margin: 0 auto;
    padding: 12px 0;
  }

  .hero{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px;}
  .org{font-weight:800;color:#071033;font-size:18px;}
  .org-sub{color:var(--muted);font-size:13px;}
  .page-title{font-size:30px;font-weight:900;color:#04102a;margin:0;}
  .page-sub{color:var(--muted);font-size:13px;margin-top:6px;}

  .programs{display:flex;gap:12px;margin-top:18px;margin-bottom:20px;margin-top:5px;justify-content:center;flex-wrap: wrap;}
  .prog-btn{padding:12px 20px;border-radius:12px;font-weight:800;font-size:15px;border:none;color:#fff;cursor:pointer;min-width:200px}
  .prog-btn.student{background:linear-gradient(90deg,var(--accent-A),var(--accent-B));}
  .prog-btn.fluency{background:linear-gradient(90deg,#00c2a8,#06b6d4);}
  .prog-btn.ai4cs{background:linear-gradient(90deg,#ff7a59,#ffb86b);}
  .prog-btn.active{transform:translateY(-6px);box-shadow:0 18px 40px rgba(4,10,40,0.12);}
  .prog-btn.digit {background: linear-gradient(90deg, #6366f1, #8b5cf6); /* Indigo → Violet */}
  .prog-btn.ailit {background: linear-gradient(90deg, #3b82f6, #06b6d4); /* Blue → Cyan */}
  .prog-btn.aifun1 {background: linear-gradient(90deg, #f59e0b, #fbbf24); /* Amber → Yellow */}
  .prog-btn.aifun2 {background: linear-gradient(90deg, #10b981, #34d399); /* Emerald → Green */}
  .prog-btn.reco {background: linear-gradient(90deg, #06b6d4, #8b5cf6); /* cyan -> violet */ }
  .prog-btn.opportunity {background: linear-gradient(90deg, #ef4444, #f97316); /* Red → Orange */ }
  .prog-btn.recommendation {background: linear-gradient(90deg, #14b8a6, #3b82f6); /* Teal → Blue */ }


  .tabs{display:flex;gap:0;border-bottom:1px solid rgba(11,22,65,0.06);margin-bottom:18px;}
  .tab{flex:1;text-align:center;padding:12px 0;font-weight:800;color:#475569;cursor:pointer;position:relative;}
  .tab.active{color:#04102a;}
  .tab.active::after{content:"";position:absolute;left:14%;width:72%;height:4px;bottom:-1px;background:linear-gradient(90deg,var(--accent-A),var(--accent-B));border-radius:8px;}

  .header-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:12px;}
  .controls{display:flex;gap:12px;align-items:center;}
  input[type=text],select,textarea{padding:10px 12px;border-radius:10px;border:1px solid rgba(11,22,65,0.06);background:white;min-width:220px;}

  .grid{display:grid;grid-template-columns:repeat(1,1fr);gap:18px;}
  @media(min-width:1000px){.grid{grid-template-columns:repeat(3,1fr);} }
  .column{border-radius:14px;padding:16px;min-height:200px;border:1px solid rgba(11,22,65,0.03);background:linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,251,255,0.98));position:relative;overflow:hidden;}
  .column::before{content:"";position:absolute;left:0;right:0;top:0;height:48px;border-top-left-radius:14px;border-top-right-radius:14px;z-index:0;pointer-events:none;opacity:0.95;}
  .column[data-tier="Explore"]::before{background:linear-gradient(90deg, rgba(37,99,235,0.12), rgba(124,58,237,0.08));}
  .column[data-tier="Learn"]::before{background:linear-gradient(90deg, rgba(6,182,212,0.10), rgba(14,165,233,0.08));}
  .column[data-tier="Video"]::before{background:linear-gradient(90deg, rgba(250,130,60,0.10), rgba(255,184,108,0.06));}
  .tier-title{display:inline-block;padding:8px 12px;border-radius:12px;background:rgba(255,255,255,0.92);font-weight:800;color:#04102a;margin-bottom:12px;z-index:2;}

  .card{background:#fff;border-radius:12px;padding:14px;border:1px solid rgba(11,22,65,0.04);transition:transform .12s ease;cursor:pointer;position:relative;}
  .card:hover{transform:translateY(-6px);box-shadow:0 22px 48px rgba(11,22,65,0.08);}
  .card .meta{font-size:13px;color:var(--muted);margin-top:8px;}
  .chip { display:inline-block; padding:6px 8px; font-size:12px; border-radius:999px; background:var(--chip-bg); color:#071033; font-weight:700; margin-left:8px; }
  .chip.micro { background: linear-gradient(90deg,#e6f7ff,#dff9ff); color:#054a5a; border:1px solid rgba(6,182,212,0.06); }
  .chip.complement { background: linear-gradient(90deg,#fff7ed,#fff1d6); color:#6b3a05; border:1px solid rgba(250,184,108,0.06); }

  .details{margin-top:18px;display:flex;gap:20px;align-items:flex-start;}
  .gap-list{flex:1;background:linear-gradient(90deg,rgba(255,255,255,0.98),rgba(249,250,251,0.98));padding:18px;border-radius:12px;border:1px solid rgba(11,22,65,0.03);min-width:0;}
  .gaps-title{font-weight:900;color:#04102a;font-size:16px;margin-bottom:10px;}
  .gaps-list{margin-left:18px;line-height:1.6;color:#0b1630;}
  .gaps-list li{margin-bottom:10px;}

  .quick-panel{width:420px;flex:0 0 420px}
  .card-large{width:100%;background:var(--card);border-radius:12px;padding:18px;border:1px solid rgba(11,22,65,0.04);box-shadow:0 10px 30px rgba(11,22,65,0.04);}

  .evidence-bg { background: var(--evidence-bg); padding: 14px; border-radius: 12px; }
  .strategy-bg { background: var(--strategy-bg); padding: 14px; border-radius: 12px; }
  .personas-bg { background: var(--personas-bg); padding: 14px; border-radius: 12px; }
  .gaps-bg { background: var(--gaps-bg); padding: 14px; border-radius: 12px; }
  .reco-bg { background: var(--reco-bg); padding: 14px; border-radius: 12px; }

  pre.schema { background:#0f172a; color:#e6eef8; padding:12px; border-radius:8px; overflow:auto; font-size:13px; line-height:1.5; }
  .simulate-btn { padding:10px 14px; border-radius:10px; background: linear-gradient(90deg,var(--accent-A),var(--accent-B)); color:#fff; border:none; font-weight:800; cursor:pointer; }

  .personas-wrap{display:grid;grid-template-columns:320px 1fr;gap:24px;align-items:start;}
  .personas-intro{background:linear-gradient(180deg,#fff,#fbfbff);padding:20px;border-radius:12px;border:1px solid rgba(11,22,65,0.03);}
  .personas-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
  .persona-card{background:#fff;border-radius:12px;padding:18px;border:1px solid rgba(11,22,65,0.04);box-shadow:0 10px 26px rgba(11,22,65,0.04);min-height:260px;}
  .avatar{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:12px;border:6px solid rgba(6,182,212,0.08);background:#eaf8ff;font-weight:800;color:#04102a;font-size:22px}
  .persona-name{font-weight:900;color:#04102a;margin-bottom:8px}
  .persona-sub{color:var(--muted);margin-bottom:10px;font-size:13px}
  .persona-list{margin-left:16px;line-height:1.5;color:#1f2937;font-size:13px}

  .modal-overlay{position:fixed;inset:0;background:rgba(6,12,30,0.45);display:flex;justify-content:center;align-items:center;z-index:1200;padding:20px;}
  .modal-content{width:100%;max-width:760px;background:linear-gradient(180deg,#fff,#fbfbff);border-radius:14px;padding:22px;box-shadow:0 30px 80px rgba(6,12,30,0.35);border:1px solid rgba(11,22,65,0.06);}

/* small responsive */
  @media(max-width:980px){
    .container{min-width:0;padding:18px;}
    .grid{grid-template-columns:1fr;}
    .personas-wrap{grid-template-columns:1fr;}
    .personas-grid{grid-template-columns:repeat(1,1fr);}
    .quick-panel{width:100%;flex:0 0 auto;}
    .tab-content{padding: 6px 0; max-width: 100%;}
  }
  `;
  if (!document.getElementById("skillsbuild-styles")) {
    const s = document.createElement("style");
    s.id = "skillsbuild-styles";
    s.innerHTML = css;
    document.head.appendChild(s);
  }
};


function downloadCSV(filename, rows) {
  if (!rows || !rows.length) {
    alert("No rows to export.");
    return;
  }
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map(r => keys.map(k => {
      const v = r[k] === null || r[k] === undefined ? "" : String(r[k]).replace(/"/g, '""');
      return (v.includes(",") || v.includes("\n") || v.includes('"')) ? `"${v}"` : v;
    }).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function PrintModal({ title, children, onClose }) {
  useEffect(() => {
    const t = setTimeout(() => { window.print(); }, 240);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 900 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 900 }}>{title}</div>
          <div>
            <button className="btn" onClick={onClose} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>Close</button>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}


function mockAutograde(submission) {
  const rubricKeys = ["problem_clarity", "design_reasoning", "implementation", "validation", "reflection"];
  const scores = {};
  rubricKeys.forEach(k => {
    const v = submission.process && submission.process[k];
    if (!v) scores[k] = 0;
    else {
      const len = typeof v === "string" ? v.trim().split(/\s+/).length : JSON.stringify(v).length;
      scores[k] = len < 8 ? 2 : len < 25 ? 3 : len < 80 ? 4 : 5;
    }
  });
  const rubricAvg = Object.values(scores).reduce((a, b) => a + b, 0) / rubricKeys.length;
  const repoScore = submission.repoUrl ? 5 : 0;
  const artifactsScore = (submission.artifacts && submission.artifacts.length) ? 5 : 0;
  const combined = Math.round(((rubricAvg * 0.75) + ((repoScore + artifactsScore) / 10) * 0.25) * 10) / 10;
  const passed = combined >= 3.2;
  return { scores, rubricAvg, repoScore, artifactsScore, combined, passed, source: "mock" };
}

async function callLLMScoring(submission) {
  try {
    const res = await fetch("/api/autograde", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ submission })
    });
    if (!res.ok) throw new Error("LLM endpoint failure");
    const data = await res.json();
    return { ...data, source: "llm" };
  } catch (e) {
    return mockAutograde(submission);
  }
}

function computeAgreementPercent(reviews) {
  if (!reviews || reviews.length < 2) return null;
  const keys = Object.keys(reviews[0].scores || {});
  let totalPairs = 0, totalAgree = 0;
  for (let i = 0; i < reviews.length; i++) {
    for (let j = i + 1; j < reviews.length; j++) {
      totalPairs++;
      let pairAgree = 0;
      keys.forEach(k => {
        const a = reviews[i].scores[k] || 0;
        const b = reviews[j].scores[k] || 0;
        pairAgree += (Math.abs(a - b) <= 1) ? 1 : 0;
      });
      totalAgree += (pairAgree / keys.length);
    }
  }
  return Math.round((totalAgree / totalPairs) * 100);
}

const REVIEWERS = [
  { id: "peer_rahul", name: "Rahul" },
  { id: "peer_ben", name: "Ben" },
  { id: "peer_chloe", name: "Chloe" },
  { id: "peer_sanjana", name: "Sanjana" }
];

const JSON_SCHEMA = {
  title: "SubmissionMetadata",
  type: "object",
  properties: {
    submissionId: { type: "string" },
    courseId: { type: "integer" },
    learnerId: { type: "string" },
    repoUrl: { type: "string", format: "uri" },
    artifacts: { type: "array", items: { type: "object", properties: { type: { type: "string" }, url: { type: "string", format: "uri" } } } },
    process: {
      type: "object",
      properties: {
        problem_clarity: { type: "string" },
        design_reasoning: { type: "string" },
        implementation: { type: "string" },
        validation: { type: "string" },
        reflection: { type: "string" }
      }
    },
    meta: { type: "object" }
  },
  required: ["submissionId", "courseId", "learnerId", "repoUrl", "process"]
};

const exampleSubmission = {
  submissionId: "sb-2025-0001",
  courseId: 16,
  learnerId: "user_abc123",
  repoUrl: "https://github.com/learner/build-ai-agent",
  artifacts: [{ type: "notebook", url: "https://github.com/learner/build-ai-agent/blob/main/notebook.ipynb" }],
  process: {
    problem_clarity: "Build an AI agent that answers student questions using small context windows. Success: >75% helpfulness in testing set, latency < 300ms.",
    design_reasoning: "We chose RAG due to cost and faster iteration.",
    implementation: "Used Python + LangChain, Pinecone for embeddings, OpenAI for responses. Key files: src/ingest.py, src/agent.py",
    validation: "Accuracy tests on 200 QA pairs; edge cases identified for ambiguous intent. Unit tests included.",
    reflection: "RAG approach worked; need to improve prompt templates for contextual recall. Next: add feedback loop."
  },
  meta: { duration_hours: 4, tags: ["RAG", "agent"] }
};


function Collapsible({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        <div style={{ fontWeight: 800 }}>{title}</div>
        <div style={{ color: "#64748b" }}>{open ? "▾" : "▸"}</div>
      </div>
      {open && <div style={{ marginTop: 8 }}>{children}</div>}
    </div>
  );
}


export default function App() {
  useEffect(() => { injectStyles(); }, []);

  const [program, setProgram] = useState(null);
  const [activeTab, setActiveTab] = useState("map");
  const [search, setSearch] = useState("");
  const [personaFilter, setPersonaFilter] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [submissionText, setSubmissionText] = useState(JSON.stringify(exampleSubmission, null, 2));
  const [autogradeResult, setAutogradeResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedComplement, setSelectedComplement] = useState(null);
  const [showComplementPanel, setShowComplementPanel] = useState(false);
  const [printModal, setPrintModal] = useState(null);

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      if (personaFilter && !c.personas.includes(personaFilter)) return false;
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [personaFilter, search]);

  const grouped = useMemo(() => {
    const g = { Explore: [], Learn: [], Video: [] };
    filtered.forEach((c) => {
      if (!g[c.tier]) g[c.tier] = [];
      g[c.tier].push(c);
    });
    return g;
  }, [filtered]);

  function handleComplementClick(complementId) {
    if (!complementId) return;
    if (selectedComplement === complementId) { setSelectedComplement(null); setShowComplementPanel(false); }
    else { setSelectedComplement(complementId); setShowComplementPanel(true); }
  }


  function prefillSubmissionForPersona(persona, course) {
    const base = {
      submissionId: `sb-demo-${Date.now()}`,
      courseId: course?.id || exampleSubmission.courseId,
      learnerId: "demo_user_exec",
      repoUrl: "",
      artifacts: [],
      process: { problem_clarity: "", design_reasoning: "", implementation: "", validation: "", reflection: "" },
      meta: { courseTitle: course?.title || "", persona: persona, duration_hours: course?.duration || 1.5 }
    };
    if (persona === "Student Developers") {
      base.repoUrl = "https://github.com/demo/student-demo-repo";
      base.artifacts = [
        { type: "notebook", url: "https://github.com/demo/student-demo-repo/blob/main/notebook.ipynb" },
        { type: "live-demo", url: "https://demo.example.com/semantic-search" }
      ];
      base.process.problem_clarity = `Build a portfolio-grade demo for "${base.meta.courseTitle}". Success metric: demo works end-to-end.`;
      base.process.implementation = "Include README with run instructions; key files: src/, notebook.ipynb";
      base.process.reflection = "What worked, trade-offs, next improvements.";
    } else if (persona === "AI/Tech Professionals") {
      base.repoUrl = "https://github.com/demo/tech-demo";
      base.artifacts = [{ type: "evaluation", url: "https://gist.github.com/demo/embedding-eval" }];
      base.process.problem_clarity = `Integration-focused: embed retrieval into production pipeline for "${base.meta.courseTitle}"`;
      base.process.design_reasoning = "Chosen architecture: vector DB + RAG; tradeoffs considered: latency vs freshness";
      base.process.validation = "Evaluation on n=200 queries; measured MRR and latency.";
    } else {
      base.repoUrl = "";
      base.artifacts = [
        { type: "case-study", url: "https://docs.example.com/case-study-embeddings" },
        { type: "screenshots", url: "https://imgur.com/demo-screenshots" }
      ];
      base.process.problem_clarity = `Business use-case: improve customer support search using embeddings for "${base.meta.courseTitle}"`;
      base.process.reflection = "High-level risks, stakeholders impacted, success measures (e.g., reduced time-to-resolution).";
      base.meta.caseStudy = "One-page business case: current challenge, expected improvement, KPIs.";
    }

    setSubmissionText(JSON.stringify(base, null, 2));
    setActiveTab("evidence");
  }

  async function runAutogradeFromText(text) {
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) { alert("Invalid JSON — fix syntax and retry."); return; }
    setRunning(true); setAutogradeResult(null);
    try {
      const result = await callLLMScoring(parsed);
      setAutogradeResult(result);
      const entry = { id: `entry_${Date.now()}`, ts: new Date().toISOString(), submission: parsed, result, reviews: [], expertSample: false, assignedReviewerIds: [] };
      setPortfolio((p) => [entry, ...p]);
    } catch (e) {
      const result = mockAutograde(parsed);
      setAutogradeResult(result);
      const entry = { id: `entry_${Date.now()}`, ts: new Date().toISOString(), submission: parsed, result, reviews: [], expertSample: false, assignedReviewerIds: [] };
      setPortfolio((p) => [entry, ...p]);
    } finally { setRunning(false); }
  }


  function sampleForExpertReview() {
    if (!portfolio.length) { alert("No entries to sample."); return; }
    const n = Math.max(1, Math.round(portfolio.length * 0.1));
    const idxs = new Set();
    while (idxs.size < n) idxs.add(Math.floor(Math.random() * portfolio.length));
    setPortfolio((p) => p.map((entry, i) => idxs.has(i) ? { ...entry, expertSample: true } : entry));
    alert(`Sampled ${n} entries for expert review.`);
  }

  function clearPortfolio() {
    if (!window.confirm("Clear all portfolio entries?")) return;
    setPortfolio([]);
  }

  function assignReviewerToEntry(entryId, reviewerId) {
    setPortfolio((p) => p.map((e) => {
      if (e.id !== entryId) return e;
      const ids = new Set(e.assignedReviewerIds || []);
      if (reviewerId) ids.add(reviewerId);
      return { ...e, assignedReviewerIds: Array.from(ids) };
    }));
  }

  function addPeerReview(entryId, reviewerId, scores, comment) {
    setPortfolio((p) => p.map((e) => {
      if (e.id !== entryId) return e;
      const reviews = [...(e.reviews || [])].filter(r => r.reviewerId !== reviewerId);
      reviews.push({ reviewerId, scores, comment });
      const agreementPercent = computeAgreementPercent(reviews);
      return { ...e, reviews, agreementPercent };
    }));
  }

  function exportPortfolioCSV() {
    if (!portfolio.length) { alert("No portfolio entries to export."); return; }
    const rows = portfolio.map(e => ({
      id: e.id,
      ts: e.ts,
      submissionId: e.submission.submissionId,
      courseId: e.submission.courseId,
      learnerId: e.submission.learnerId,
      repoUrl: e.submission.repoUrl,
      artifacts: (e.submission.artifacts || []).map(a => a.url || a.type).join(" | "),
      combined: e.result.combined,
      passed: e.result.passed ? "PASS" : "REVIEW",
      reviewers: (e.assignedReviewerIds || []).join(";"),
      expertSample: e.expertSample ? "yes" : "no",
      agreementPercent: e.agreementPercent || ""
    }));
    downloadCSV(`portfolio_snapshot_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`, rows);
  }

  function exportModulesCSV() {
    const rows = Object.values(MODULES).map(m => ({ id: m.id, title: m.title, lane: m.lane, description: m.desc, link: m.link || "" }));
    downloadCSV(`skillsbuild_modules_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`, rows);
  }

  function openPrintModalForPortfolio() { setPrintModal({ type: "portfolio" }); }
  function openPrintModalForModules() { setPrintModal({ type: "modules" }); }


  function CourseCard({ course }) {
    return (
      <div className="card" role="button" onClick={() => setSelectedCourse(course)}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 900 }}>{course.title}</div>
            <div style={{ marginTop: 8 }}>
              <span className="chip complement" onClick={(e) => { e.stopPropagation(); handleComplementClick(course.complements); }}>
                {course.complements && course.complements !== "New" ? `Enhances: ${course.complements}` : "New"}
              </span>
              {course.microModule && <span className="chip micro">Micro-capsule</span>}
            </div>
          </div>
          <div style={{ color: "#64748b", fontWeight: 700 }}>{course.duration}h</div>
        </div>
        <div style={{ marginTop: 8, color: "#475569" }}>{course.personas.join(" • ")}</div>
      </div>
    );
  }

  function CourseModal({ course, onClose }) {
    useEffect(() => {
      function onEsc(e) { if (e.key === "Escape") onClose(); }
      document.addEventListener("keydown", onEsc);
      return () => document.removeEventListener("keydown", onEsc);
    }, [onClose]);

    if (!course) return null;
    const moduleInfo = MODULES[course.complements] || null;
    return (
      <AnimatePresence>
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="modal-content" initial={{ y: 24, scale: 0.98, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 12, scale: 0.98, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 24 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>{course.title}</div>
                <div style={{ color: "#64748b", marginTop: 6 }}>Tier: {course.tier} • Duration: {course.duration}h</div>
              </div>
              <div>
                <div style={{ color: "#64748b", marginBottom: 6 }}>{course.personas.join(", ")}</div>
                <button style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)", background: "#fff", cursor: "pointer", fontWeight: 800 }} onClick={onClose}>Close</button>
              </div>
            </div>

            <div style={{ fontSize: 14, color: "#15213a", lineHeight: 1.6 }}>
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Summary</div>
              <div style={{ marginBottom: 12 }}>This course can be wrapped with the standardized submission schema to collect process evidence (problem framing, design, implementation, validation and reflection).</div>

              {moduleInfo && (
                <div style={{ marginBottom: 12, padding: 12, background: "#fbfbff", borderRadius: 8 }}>
                  <div style={{ fontWeight: 900 }}>{moduleInfo.title}</div>
                  <div style={{ color: "#64748b", marginTop: 6 }}>{moduleInfo.desc}</div>
                </div>
              )}

              <div style={{ marginTop: 10 }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>One-click Evidence Checklist</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {course.personas.map((p) => (
                    <button key={p} className="btn primary" onClick={() => prefillSubmissionForPersona(p, course)} title={`Insert a prefilled submission payload for ${p}`} style={{ padding: "8px 12px", borderRadius: 8, background: "linear-gradient(90deg,var(--accent-A),var(--accent-B))", color: "#fff", border: "none", fontWeight: 800 }}>
                      Prefill for {p}
                    </button>
                  ))}
                </div>
                <div style={{ color: "#64748b", marginTop: 10 }}>
                  Click a button to auto-fill the JSON submission editor with a persona-specific checklist (you will be taken to the Evidence tab where you can edit and run the autograder).
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 800, marginBottom: 8 }}>Suggested assignment</div>
                <div style={{ color: "#425066" }}>Repo-based starter template + process template: Plan → Build → Reflect. Attach metadata JSON for automation and AI scoring.</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }


  const PersonasView = (
    <div className="tab-content personas-bg">
      <div className="personas-wrap">
        <div className="personas-intro">
          <div style={{ fontSize: 20, fontWeight: 900, color: "#04102a", marginBottom: 8 }}>Student Developer personas</div>
          <div style={{ color: "#475569", lineHeight: 1.6 }}>
            The Student Developer program targets three student developer personas who have slightly different motivations and outcomes from an AI/dev pathway.
          </div>
        </div>
        <div>
          <div className="personas-grid">
            <div className="persona-card">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="avatar" style={{ background: "linear-gradient(90deg,#ffd9b3,#ffb86b)", borderColor: "rgba(255,184,108,0.08)" }}>CS</div>
                <div>
                  <div className="persona-name">Cerebral Sam</div>
                  <div className="persona-sub">Master's or Bachelor's in CS/Data Science; motivated by innovation.</div>
                </div>
              </div>
              <ul className="persona-list" style={{ marginTop: 12 }}>
                <li><strong>Motivation:</strong> Build innovative projects with industry relevance.</li>
                <li><strong>Needs:</strong> Deep labs, mentor feedback, challenge projects.</li>
                <li><strong>Benefit:</strong> Portfolio-worthy projects and mentorship.</li>
              </ul>
            </div>

            <div className="persona-card">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="avatar" style={{ background: "linear-gradient(90deg,#e0f2fe,#c7f9ff)", borderColor: "rgba(6,182,212,0.08)" }}>AA</div>
                <div>
                  <div className="persona-name">All-In Allie</div>
                  <div className="persona-sub">Undergrad CS/IT; builds small apps and demos.</div>
                </div>
              </div>
              <ul className="persona-list" style={{ marginTop: 12 }}>
                <li><strong>Motivation:</strong> Ship small demos and get internships.</li>
                <li><strong>Needs:</strong> Hands-on exercises and quick wins.</li>
                <li><strong>Benefit:</strong> Interview-ready demos and badges.</li>
              </ul>
            </div>

            <div className="persona-card">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div className="avatar" style={{ background: "linear-gradient(90deg,#eef2ff,#e9d5ff)", borderColor: "rgba(139,92,246,0.08)" }}>CC</div>
                <div>
                  <div className="persona-name">Curious Corrie</div>
                  <div className="persona-sub">Non-CS major; curious about AI but short on time.</div>
                </div>
              </div>
              <ul className="persona-list" style={{ marginTop: 12 }}>
                <li><strong>Motivation:</strong> Explore AI concepts without heavy commitment.</li>
                <li><strong>Needs:</strong> Short capsules, plain-language case studies.</li>
                <li><strong>Benefit:</strong> Conceptual fluency and micro-badges.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function GapsView() {
    const gapData = [
      { id: "ethics", label: "Ethics (practical)", pct: 78, note: "Need hands-on case labs & compliance exercises" },
      { id: "domain", label: "Domain specialization", pct: 64, note: "Healthcare, Finance, Legal — Learn-level tracks" },
      { id: "emerging", label: "Emerging skills", pct: 55, note: "Prompt engineering, Vibe Coding, AI workflows" },
      { id: "prod", label: "Production readiness", pct: 70, note: "Deployment, observability, model ops" }
    ];


    function GapBarChart({ data, height = 220, gap = 24 }) {
      const max = 100;
      const barW = Math.max(100, Math.floor((900 / data.length) - gap));
      const chartWidth = data.length * (barW + gap);
      const viewBox = `0 0 ${chartWidth} ${height}`;

      return (
        <div style={{ overflowX: "auto", paddingTop: 12 }}>
          <svg viewBox={viewBox} width="100%" height={height} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Gaps bar chart">
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#0066ff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.95" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#071033" floodOpacity="0.08" />
              </filter>
            </defs>

            {data.map((d, i) => {
              const x = i * (barW + gap) + gap / 2;

              const barHeight = Math.max(12, Math.round((d.pct / max) * (height - 80)));
              const y = height - 50 - barHeight;
              const labelY = Math.max(14, y - 10); // ensure not negative
              return (
                <g key={d.id} transform={`translate(${x},0)`}>

                  <rect x="0" y={height - 50 - (height - 80)} width={barW} height={height - 80} rx="10" ry="10" fill="#f1f5f9" />


                  <rect x="0" y={y} width={barW} height={barHeight} rx="10" ry="10" fill="url(#g1)" filter="url(#shadow)" />


                  <foreignObject x="0" y={height - 46} width={barW} height="46">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontSize: 13, textAlign: "center", color: "#15213a", fontWeight: 800, padding: "4px 6px" }}>
                      {d.label}
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginTop: 4 }}>{d.note}</div>
                    </div>
                  </foreignObject>


                  <text
                    x={barW / 2}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="800"
                    fill="#04102a"
                    paintOrder="stroke"
                    stroke="#ffffff"
                    strokeWidth="3"
                  >
                    {d.pct}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }



    return (
      <div className="tab-content gaps-bg">

        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Enhancements & Opportunities</div>
        <div style={{ color: "#64748b", marginBottom: 12 }}>Where we can extend SkillsBuild with new courses, modules and micro-capsules.</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "#fff", padding: 14, borderRadius: 12 }}>
            <div style={{ fontWeight: 800 }}>Ethics (practical)</div>
            <div style={{ color: "#475569", marginTop: 8 }}>Move ethics beyond awareness — case-driven decision labs and compliance exercises.</div>
          </div>
          <div style={{ background: "#fff", padding: 14, borderRadius: 12 }}>
            <div style={{ fontWeight: 800 }}>Domain specialization</div>
            <div style={{ color: "#475569", marginTop: 8 }}>Healthcare, Finance, Legal — short Learn tracks that map directly to professional tasks.</div>
          </div>
          <div style={{ background: "#fff", padding: 14, borderRadius: 12 }}>
            <div style={{ fontWeight: 800 }}>Emerging skills</div>
            <div style={{ color: "#475569", marginTop: 8 }}>Add <em>Vibe Coding</em>, <em>Prompt Engineering for Business</em>, and <em>AI-Powered Workflows</em>.</div>
          </div>
          <div style={{ background: "#fff", padding: 14, borderRadius: 12 }}>
            <div style={{ fontWeight: 800 }}>Production readiness</div>
            <div style={{ color: "#475569", marginTop: 8 }}>Hands-on labs for deployment, observability and model ops for multiagent systems.</div>
          </div>
        </div>


        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 900 }}>Enhancements - graphical view</div>
            <div style={{ color: "#64748b", fontSize: 13 }}>Visual snapshot of priority gaps (higher % = larger gap to close)</div>
          </div>

          <GapBarChart data={gapData} />

          <div style={{ marginTop: 12, color: "#64748b", fontSize: 13 }}>
            Notes: percentages are illustrative diagnostics and can be adjusted to match actual needs-assessment results. If you want, I can wire these figures to live survey inputs or compute them from learner metrics.
          </div>
        </div>
      </div>
    );
  }

  const ROLE_RECOMMENDATIONS = [
    {
      roleType: "Healthcare Roles",
      examples: "Nurses, Medical Assistants, Health IT Specialists, Health Services Managers",
      recs: [
        "Automate appointment scheduling, EHR coding, billing workflows.",
        "Augment diagnostics with AI image recognition & clinical decision support.",
        "Optimize hospital resource allocation using predictive analytics.",
        "Eliminate redundant paperwork through speech-to-text."
      ]
    },
    {
      roleType: "Finance Roles",
      examples: "Accountants, Financial Analysts, Loan Officers, Claims Adjusters",
      recs: [
        "Automate reconciliation, data entry, compliance reporting.",
        "Augment forecasting, fraud detection, investment modelling.",
        "Optimize credit risk scoring, portfolio management.",
        "Eliminate manual spreadsheet-driven analysis."
      ]
    },
    {
      roleType: "Marketing & Retail Roles",
      examples: "Marketing Analysts, E-commerce Managers, Customer Experience Specialists",
      recs: [
        "Automate campaign execution, ad placement, product recommendations.",
        "Augment market research with AI-driven insights.",
        "Optimize inventory & pricing through demand forecasting.",
        "Eliminate low-value manual data collection."
      ]
    },
    {
      roleType: "HR & Learning Roles",
      examples: "Recruiters, HR Specialists, Training Designers, L&D Managers",
      recs: [
        "Automate resume screening, FAQ handling with chatbots.",
        "Augment candidate matching and workforce analytics.",
        "Optimize learning pathways with adaptive AI content.",
        "Eliminate repetitive onboarding paperwork."
      ]
    },
    {
      roleType: "Operations & Logistics Roles",
      examples: "Logisticians, Supply Chain Analysts, Warehouse Managers",
      recs: [
        "Automate shipment tracking, route scheduling.",
        "Augment demand planning with predictive AI models.",
        "Optimize warehouse layouts and delivery efficiency.",
        "Eliminate manual order reconciliations."
      ]
    },
    {
      roleType: "Education Roles",
      examples: "Teachers, Instructional Designers, Academic Advisors",
      recs: [
        "Automate grading of objective assessments, admin tasks.",
        "Augment learning with personalized AI tutoring.",
        "Optimize curricula via learning analytics.",
        "Eliminate redundant course material updates by using AI assistants."
      ]
    },
    {
      roleType: "Technical Roles",
      examples: "Software Developers, Data Scientists, Cybersecurity Analysts, Cloud Engineers",
      recs: [
        "Automate code generation, bug detection, test automation.",
        "Augment developers with AI pair-programming tools.",
        "Optimize system monitoring & cloud resource allocation with AI.",
        "Eliminate repetitive data cleaning tasks."
      ]
    }
  ];

  function OpportunitiesView() {
  // local modal state
  const [selectedEntry, setSelectedEntry] = useState(null);

  // frontend-only mock analyzer (no backend)
  function mockAnalyze(item) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const title = (item.title || "").toLowerCase();
        const desc = (item.body || "").trim();
        const isEthics = title.includes("ethic");
        const isHealthcare = title.includes("health");
        const isFinance = title.includes("finance");
        const isSimulation = title.includes("simulation") || title.includes("process");
        const isOutcome = title.includes("outcome") || title.includes("learning") || title.includes("capstone");

        const suggestedTags = [];
        if (isEthics) suggestedTags.push("ethics", "case-lab");
        if (isHealthcare) suggestedTags.push("healthcare");
        if (isFinance) suggestedTags.push("finance");
        if (isSimulation) suggestedTags.push("simulation", "scenario");
        if (isOutcome) suggestedTags.push("learning-outcome", "assessment");
        if (!suggestedTags.length) suggestedTags.push("pilot", "micro-module");

        const priority = isHealthcare || isFinance || isOutcome ? "high" : isSimulation ? "medium" : "low";

        const pilotDraft = {
          objective: `Pilot: test learner uptake for "${item.title}" with a small cohort.`,
          durationWeeks: isSimulation ? 4 : 3,
          resources: ["1 instructor", "starter repo", "sandbox / notebook"],
          successMetrics: isEthics ? [">80% correct decisions in case labs", "completion rate > 60%"] : ["completion rate > 50%", "learner satisfaction > 4/5"]
        };

        const ai = {
          summary: desc ? (desc.length > 240 ? desc.slice(0, 240) + "…" : desc) : `Short summary: ${item.title} — pilot-ready idea to test learner impact.`,
          suggestedTags,
          priority,
          pilotDraft,
          jobMatches: [
            { role: "Instructional Designer", matchPct: isOutcome ? 85 : 60 },
            { role: "Training Specialist", matchPct: isSimulation ? 78 : 52 }
          ],
        };

        resolve(ai);
      }, 300); // fake latency
    });
  }

  // add to roadmap: open modal immediately, then attach AI result when ready
  async function addToRoadmap(item) {
    const entry = { id: `temp_${Date.now()}`, title: item.title, description: item.body, ai: null, status: "pending" };
    setSelectedEntry(entry); // open modal immediately (shows loading)
    try {
      const ai = await mockAnalyze(item);
      setSelectedEntry({ ...entry, ai, status: "candidate" });
    } catch (err) {
      setSelectedEntry({ ...entry, ai: null, status: "error" });
      console.error("mockAnalyze failed", err);
    }
  }

 
  function RoadmapModal({ entry, onClose }) {
  if (!entry) return null;
  const ai = entry.ai;

  const chipStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#fff",
    boxShadow: "0 6px 18px rgba(12,16,30,0.06)",
    border: "1px solid rgba(11,22,65,0.04)",
    fontSize: 13,
    color: "#0f172a",
    fontWeight: 600,
  };

  const headerStyle = {
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(180deg, rgba(6,12,30,0.45), rgba(6,12,30,0.45))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1400,
        padding: 20,
        WebkitFontSmoothing: "antialiased",
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={entry.title}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 640,
          maxWidth: "96%",
          maxHeight: "86vh",
          overflow: "auto",
          borderRadius: 14,
          background: "#ffffff",
          padding: 24,
          boxShadow: "0 30px 60px rgba(2,6,23,0.48)",
          border: "1px solid rgba(11,22,65,0.06)",
          fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto",
          color: "#0f172a",
        }}
      >
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(90deg,#eef2ff,#e6f7ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#0b2545", fontSize: 16 }}>
              OP
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#0b2545", lineHeight: 1.1 }}>{entry.title}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: "#64748b" }}>Opportunities • AI-assisted brief</div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              border: "none",
              background: "transparent",
              color: "#475569",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: 8,
              borderRadius: 8,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ height: 1, background: "linear-gradient(90deg, rgba(6,182,212,0.06), rgba(139,92,246,0.06))", margin: "18px 0", borderRadius: 2 }} />

        {/* Body */}
        {!ai && (
          <div style={{ padding: 18, borderRadius: 10, background: "#fbfbff", textAlign: "center", color: "#64748b", fontWeight: 600 }}>
            Running quick AI analysis… <small style={{ display: "block", marginTop: 8, fontWeight: 500 }}>This is a frontend mock — no external calls.</small>
          </div>
        )}

        {ai && (
          <div style={{ display: "grid", gap: 18 }}>
            {/* Summary */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0b2545", marginBottom: 8 }}>AI Summary</div>
              <p style={{ margin: 0, color: "#334155", lineHeight: 1.6, fontSize: 14 }}>{ai.summary}</p>
            </div>

            {/* Tags + Priority */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                {ai.suggestedTags.map((t, i) => (
                  <span key={i} style={{ padding: "6px 10px", borderRadius: 999, background: "#f8fafc", color: "#0b2545", fontWeight: 600, fontSize: 13, border: "1px solid rgba(11,22,65,0.04)" }}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", marginRight: 6 }}>Priority</div>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 13,
                    color: ai.priority === "high" ? "#7f1d1d" : ai.priority === "medium" ? "#713f12" : "#065f46",
                    background: ai.priority === "high" ? "#fff1f2" : ai.priority === "medium" ? "#fffbeb" : "#ecfdf5",
                    border: "1px solid rgba(11,22,65,0.04)",
                    boxShadow: "0 6px 16px rgba(12,16,30,0.04)",
                  }}
                >
                  {ai.priority.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Pilot Draft */}
            <div style={{ background: "#fbfbff", padding: 14, borderRadius: 10, border: "1px solid rgba(11,22,65,0.03)" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0b2545", marginBottom: 8 }}>Pilot Draft</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12 }}>
                <div style={{ color: "#334155", fontSize: 14, lineHeight: 1.6 }}>
                  <div><strong>Objective:</strong> <span style={{ fontWeight: 600 }}>{ai.pilotDraft.objective}</span></div>
                  <div style={{ marginTop: 8 }}><strong>Resources:</strong> {ai.pilotDraft.resources.join(", ")}</div>
                </div>

                <div style={{ textAlign: "right", color: "#334155", fontSize: 14 }}>
                  <div style={{ fontWeight: 700 }}>Duration</div>
                  <div style={{ marginTop: 6 }}>{ai.pilotDraft.durationWeeks} weeks</div>
                </div>
              </div>

              {ai.pilotDraft.successMetrics && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 700, color: "#0b2545", marginBottom: 8 }}>Success metrics</div>
                  <ul style={{ margin: 0, paddingLeft: 18, color: "#334155", lineHeight: 1.6 }}>
                    {ai.pilotDraft.successMetrics.map((m, i) => (
                      <li key={i} style={{ marginBottom: 6, display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ marginTop: 6 }}>
                          <path d="M20 6L9 17l-5-5" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div style={{ flex: 1 }}>{m}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid rgba(11,22,65,0.06)",
              background: "#fff",
              color: "#475569",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Close
          </button>

          <button
            onClick={() => {
              // example "confirm" action - currently just closes modal
              // you can replace this with saving to localStorage or API call
              onClose();
            }}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(90deg,#06b6d4,#8b5cf6)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 800,
              boxShadow: "0 10px 30px rgba(6,182,212,0.12)",
            }}
          >
            Save to Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}


  const cards = [
    {
      title: "Domain specialization",
      body: "Healthcare, Finance, Legal - short Learn tracks that map directly to professional tasks."
    },
    {
      title: "Emerging skills",
      // body: "Add Vibe Coding, Prompt Engineering for Business, and AI-Powered Workflows."
      body: [
        "Vibe Coding",
        "Prompt Engineering for Business",
        "AI-Powered Workflows"
      ]
    },
        
    {
      title: "Skills -> jobs mapping (make it concrete)",
      body:
        "Show direct links between module skills and job tasks. Add a small job-mapping panel per module that lists specific tasks and role examples where the skill is used, plus a % match to common role profiles."
    },
    {
      title: "Low visibility of AI tools in practice",
      body:
        "Surface tooling and 'how-to' quickly. Add short hands-on sandboxes and one-click demos (for example, hosted notebooks, live model playgrounds) that let learners try a feature in 5–15 minutes so content feels practical, not just conceptual."
    },
    {
      title: "Ethics & risks — make them actionable",
      body:
        "Move beyond theory: add small decision labs and short compliance checklists for real scenarios. Each ethics module should include an interactive case, a quick checklist, and an example mitigation plan."
    },
    
    {
      title: "Production readiness",
      body: "Hands-on labs for deployment, observability and model ops for multiagent systems."
    },

    
    {
      title: "Cross-Industry AI Augmentation",
      body:
        "Align curriculum with role-specific AI augmentation: Finance, Healthcare, Marketing, HR, Operations and more. For example, fraud detection and personalization for Finance; AI diagnostics and patient monitoring for Healthcare; campaign optimisation and sentiment analysis for Marketing."
    },
    {
      title: "Real-World Business Process Simulation",
      body:
        "Add scenario-based role-play activities (for example, loan officer, clinician, marketer) and end-to-end process simulations to help learners identify where AI can automate, augment, optimize, or eliminate tasks."
    },
    {
      title: "Layered Assessment Strategies",
      body:
        "Introduce adaptive, AI driven assessments and project based scoring. Wrap Learn modules with Plan -> Build -> Reflect checkpoints, store standardized JSON submissions, and run automated LLM/mock autograding plus peer review so learners see clear evidence of skill growth."
    },
    {
      title: "Reuse First Wrap Strategy",
      body:
        "Keep existing content intact — add wrappers, starter repos, templates and micro-modules to avoid heavy redevelopment. Examples: capstone 'AI Opportunity Map', one-click evidence checklists, prefilled submission templates per persona."
    },
    {
      title: "Complementary Microcontent",
      body:
        "Add short complementary modules (5–30 minutes): AI for Finance, AI for Healthcare, AI for Marketing, Responsible AI for Business Leaders, and a PromptOps micro-series. Also add 'AI at Work' micro-videos showing daily task augmentation for different roles."
    },
    {
      title: "Learning outcomes not often validated",
      body:
        "Make outcomes explicit and measurable so learners know when they’ve achieved them. For example, add module-level 'I can' statements, short objective checks, and quick evidence badges tied to specific HOT (higher-order thinking) skills."
    },
    {
      title: "Implementation suggestions",
      body:
        "Start with two pilot tracks (for example, Finance & Healthcare). Wrap existing Learn modules with Plan→Build→Reflect and a small simulation. Surface micro-modules (PromptOps, Responsible AI) as short add-ons; use the standardized JSON submission + autograder pipeline to collect evidence and measure impact."
    }
  ];

  return (
    <div className="tab-content strategy-bg">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>Enhancements & Opportunities : AI Augmentation & Curriculum Wrap</div>
          <div style={{ color: "#64748b", marginTop: 6 }}>
            Practical opportunities to wrap AI augmentation around existing modules without heavy redevelopment.
          </div>
        </div>
      </div>


      <div
  style={{
    marginTop: 14,
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    alignItems: "start",
  }}
>
  {cards.map((c, idx) => (
    <div key={idx} className="card" style={{ padding: 14, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          background: "linear-gradient(180deg,#06b6d4,#8b5cf6)",
          opacity: 0.95,
        }}
      />
      <div style={{ marginLeft: 12 }}>
        <div style={{ fontWeight: 900, fontSize: 16, color: "#04102a", marginBottom: 8 }}>
          {c.title}
        </div>

        {/* Body supports both string and array */}
        <div style={{ color: "#475569", lineHeight: 1.6 }}>
          {Array.isArray(c.body) ? (
            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
              {c.body.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          ) : (
            <div style={{ whiteSpace: "pre-wrap" }}>{c.body}</div>
          )}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => addToRoadmap(c)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(90deg,var(--accent-A),var(--accent-B))",
              color: "#fff",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Add to Roadmap
          </button>

          <button
            onClick={() => alert(`Draft pilot for "${c.title}" (placeholder)`)}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid rgba(11,22,65,0.06)",
              background: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Draft Pilot
          </button>

          <div style={{ marginLeft: "auto", color: "#94a3b8", fontSize: 12, fontWeight: 700 }}>
            {/* small tag area */}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>


      {/* <div
        style={{
          marginTop: 14,
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          alignItems: "start",
        }}
      >
        {cards.map((c, idx) => (
          <div key={idx} className="card" style={{ padding: 14, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: 6,
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
                background: "linear-gradient(180deg,#06b6d4,#8b5cf6)",
                opacity: 0.95,
              }}
            />
            <div style={{ marginLeft: 12 }}>
              <div style={{ fontWeight: 900, fontSize: 16, color: "#04102a", marginBottom: 8 }}>{c.title}</div>
              <div style={{ color: "#475569", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{c.body}</div>

              <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => addToRoadmap(c)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "none",
                    background: "linear-gradient(90deg,var(--accent-A),var(--accent-B))",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Add to Roadmap
                </button>

                <button
                  onClick={() => alert(`Draft pilot for "${c.title}" (placeholder)`)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid rgba(11,22,65,0.06)",
                    background: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Draft Pilot
                </button>

                <div style={{ marginLeft: "auto", color: "#94a3b8", fontSize: 12, fontWeight: 700 }}></div>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {/* modal */}
      <RoadmapModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
  );
}






  function RecommendationsProgramView() {
  // merged cards: learner-focused AI recommendations first (assetType = "AI Feature"),
  // then the program-style cards (kept from RecommendationsView)
  const cards = [
    // AI-based, learner-focused recommendations (now in same card format)
    {
      title: "Adaptive Learning Paths",
      desc:
        "Use AI to recommend shorter or longer module versions based on prior knowledge. Example: if a learner already understands AI basics, skip or compress M1 and surface advanced exercises instead — learners get a personalized journey rather than one-size-fits-all.",
      assetType: "AI Feature"
    },
    {
      title: "AI-Driven Capstone Feedback",
      desc:
        "Integrate an AI tutor that reviews capstone drafts and project ideas, giving instant formative feedback on clarity, feasibility and ethical concerns. This turns vague '[Name TBD]' capstones into concrete, learner-validated briefs.",
      assetType: "AI Feature"
    },
    {
      title: "Practical AI Tool Simulations",
      desc:
        "Embed live sandboxes (ChatGPT-style playgrounds, HuggingFace demos, AutoML examples) so learners can practice features in 5–15 minute labs. Learners immediately see how tools connect to job tasks.",
      assetType: "AI Feature"
    },
    {
      title: "AI-Curated Real-World Cases",
      desc:
        "Automatically surface fresh, relevant case studies (recent AI wins & failures) via an AI engine so content remains current and relatable without heavy manual updating.",
      assetType: "AI Feature"
    },
    {
      title: "Skill-to-Career Mapping with AI",
      desc:
        "Match learner progress to job descriptions and show percent-skill coverage for roles (e.g., Data Analyst, AI Ethics Officer). Learners see direct career relevance and gaps to close.",
      assetType: "AI Feature"
    },
    {
      title: "AI-Based Reflection Prompts",
      desc:
        "After each module, generate personalized reflection questions (e.g., 'How would you apply AI decision-making in your role?') to deepen learning and metacognition.",
      assetType: "AI Feature"
    },

    // Program-style cards (kept from RecommendationsView)
    {
      title: "AI Apprenticeship Pathways",
      desc:
        "Structured multi-month apprenticeships that combine micro-modules, mentored capstone projects, and employer partnerships. Learners get a graded portfolio assessed via automated scoring + peer review.",
      assetType: "Program / Apprenticeship",
      
    },
    {
      title: "Synthetic Data & Privacy Labs",
      desc:
        "Hands-on labs for generating and validating synthetic datasets, including privacy-preserving techniques and evaluation metrics. Ideal for Healthcare & Finance domain learning.",
      assetType: "Lab / Hands-on Workshop",
      
    },
    {
      title: "Multi-modal Simulation Sandbox",
      desc:
        "A web sandbox where learners prototype multimodal pipelines (text → image → audio) with realistic latency and observability dashboards to mirror production constraints.",
      assetType: "Sandbox / Prototype Environment",
      
    },
    {
      title: "PromptOps & Continuous Tuning",
      desc:
        "Micro-modules teaching prompt versioning, A/B testing prompts, and operationalizing prompt performance metrics — treat prompts as code.",
      assetType: "Micro-module series / Tooling",
      
    },
    {
      title: "Immersive Case Studios",
      desc:
        "Scenario-based, narrative case studios (video + interactive tasks) that simulate cross-functional stakeholders: product, compliance, data, and ops.",
      assetType: "Immersive Case / Studio",
      
    },
    {
      title: "Auto-Assessment Marketplace",
      desc:
        "A marketplace for validator scripts, rubric templates and micro-checks. Community-contributed validators speed up rollout and keep assessments current.",
      assetType: "Platform / Marketplace",
      
    }
  ];

  // shared styles (keeps visual consistency with the rest of the UI)
  const cardStyle = {
    borderRadius: 12,
    padding: 14,
    background: "linear-gradient(180deg,#fff,#fbfdff)",
    boxShadow: "0 8px 30px rgba(6,12,30,0.04)",
    border: "1px solid rgba(11,22,65,0.04)"
  };
  const titleStyle = { fontWeight: 900, fontSize: 16, color: "#04102a" };
  const descStyle = { color: "#475569", marginTop: 8, lineHeight: 1.5 };

  return (
    <div className="tab-content reco-bg">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 20 }}>Recommendations (AI-based, learner focused)</div>
          <div style={{ color: "#64748b", marginTop: 6 }}>Learner-first AI features and program investments that make learning practical, personalized and job-aligned.</div>
        </div>
        <div style={{ color: "#64748b", fontSize: 13 }}>Adaptive paths • Capstone feedback • Tool sandboxes • Career mapping</div>
      </div>

      {/* <div style={{ display: "grid", gap: 12 }}> */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        
        {cards.slice(0, 6).map((c, i) => (
          <div key={i} className="card" style={cardStyle}>
            <div style={titleStyle}>{c.title}</div>
            <div style={descStyle}>{c.desc}</div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <div style={{ padding: "6px 10px", borderRadius: 8, background: "#fff", border: "1px solid rgba(11,22,65,0.04)", fontWeight: 700 }}>{c.assetType}</div>
              <button style={{ padding: "8px 12px", borderRadius: 10, border: "none", background: "linear-gradient(90deg,var(--accent-A),var(--accent-B))", color: "#fff", fontWeight: 800, cursor: "pointer" }} onClick={() => alert(`Add "${c.title}" to roadmap (placeholder)`)}>
                Add to Roadmap
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "rgba(11,22,65,0.04)", margin: "18px 0", borderRadius: 2 }} />

      {/* Render program-style cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {cards.slice(6).map((c, i) => (
          <div key={i} className="card" style={cardStyle}>
            <div style={titleStyle}>{c.title}</div>
            <div style={descStyle}>{c.desc}</div>
            <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ fontWeight: 800, fontSize: 12 }}>Type of asset</div>
              <div style={{ padding: "6px 10px", borderRadius: 8, background: "#fff", border: "1px solid rgba(11,22,65,0.04)", fontWeight: 700 }}>{c.assetType}</div>
              <div style={{ marginLeft: "auto" }}>
                <button style={{ padding: "8px 12px", borderRadius: 10, border: "none", background: "linear-gradient(90deg,var(--accent-A),var(--accent-B))", color: "#fff", fontWeight: 800, cursor: "pointer" }}>Add to Roadmap</button>
                <button style={{ padding: "8px 12px", marginLeft: 8, borderRadius: 10, border: "1px solid rgba(11,22,65,0.06)", background: "#fff", fontWeight: 700, cursor: "pointer" }}>Draft Pilot</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





  function RecommendationsView() {
    const cards = [
      {
        title: "AI Apprenticeship Pathways",
        desc: "Structured multi-month apprenticeships that combine micro-modules, mentored capstone projects, and employer partnerships. Learners get a graded portfolio assessed via automated scoring + peer review.",
        assetType: "Program / Apprenticeship",
        blsTargets: [
          { role: "Registered Nurses", note: "Healthcare pathway — stable demand and many annual openings.", url: "https://www.bls.gov/ooh/healthcare/registered-nurses.htm" },
          { role: "Medical Assistants", note: "Healthcare support roles growing quickly — good entry points.", url: "https://www.bls.gov/ooh/healthcare/medical-assistants.htm" }
        ]
      },
      {
        title: "Synthetic Data & Privacy Labs",
        desc: "Hands-on labs for generating and validating synthetic datasets, including privacy-preserving techniques and evaluation metrics. Ideal for Healthcare & Finance domain learning.",
        assetType: "Lab / Hands-on Workshop",
        blsTargets: [
          { role: "Home Health & Personal Care Aides", note: "Large projected growth in healthcare support occupations where safe data practices are essential for service analytics.", url: "https://www.bls.gov/ooh/healthcare/home-health-aides-and-personal-care-aides.htm" },
          { role: "Financial Analysts", note: "Finance roles increasingly need privacy-aware data tooling for modeling and compliance.", url: "https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm" }
        ]
      },
      {
        title: "Multi-modal Simulation Sandbox",
        desc: "A web sandbox where learners prototype multimodal pipelines (text → image → audio) with realistic latency and observability dashboards to mirror production constraints.",
        assetType: "Sandbox / Prototype Environment",
        blsTargets: [
          { role: "Occupational Therapy Assistants / Allied Health", note: "Healthcare allied roles benefit from multimodal training (simulations, assistive tech).", url: "https://www.bls.gov/ooh/fastest-growing.htm" },
          { role: "Instructional Designers / Training Specialists", note: "Large demand to produce scenario-based content and on-the-job training.", url: "https://www.bls.gov/emp/" }
        ]
      },
      {
        title: "PromptOps & Continuous Tuning",
        desc: "Micro-modules teaching prompt versioning, A/B testing prompts, and operationalizing prompt performance metrics — treat prompts as code.",
        assetType: "Micro-module series / Tooling",
        blsTargets: [
          { role: "Market Research Analysts / Business Analysts", note: "Data and content roles that can use prompt ops to scale insights and content generation.", url: "https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm" },
          { role: "Customer Service / Call Center Supervisors", note: "Ops and quality roles that benefit from automated conversational tooling and evaluation.", url: "https://www.bls.gov/emp/" }
        ]
      },
      {
        title: "Immersive Case Studios",
        desc: "Scenario-based, narrative case studios (video + interactive tasks) that simulate cross-functional stakeholders: product, compliance, data, and ops.",
        assetType: "Immersive Case / Studio",
        blsTargets: [
          { role: "Project Managers / Program Coordinators", note: "Cross-functional coordination skills transfer into many sectors (healthcare, finance, services).", url: "https://www.bls.gov/emp/" },
          { role: "Compliance Officers / Risk Analysts", note: "Simulated cases are useful for compliance training and risk decision-making.", url: "https://www.bls.gov/emp/" }
        ]
      },
      {
        title: "Auto-Assessment Marketplace",
        desc: "A marketplace for validator scripts, rubric templates and micro-checks. Community-contributed validators speed up rollout and keep assessments current.",
        assetType: "Platform / Marketplace",
        blsTargets: [
          { role: "Training & Development Specialists", note: "Organizations need scalable assessment pipelines across many non-ICT roles.", url: "https://www.bls.gov/emp/" },
          { role: "Clinical Data Coordinators", note: "Data/assessment validators help standardize clinical competencies and documentation.", url: "https://www.bls.gov/emp/" }
        ]
      },
      {
        title: "Synthetic Data & Privacy Labs",
        desc: "Hands-on labs for generating and validating synthetic datasets, including privacy-preserving techniques and evaluation metrics. Ideal for Healthcare & Finance domain learning.",
        assetType: "Lab / Hands-on Workshop",
        blsTargets: [
          { role: "Home Health & Personal Care Aides", note: "Large projected growth in healthcare support occupations where safe data practices are essential for service analytics.", url: "https://www.bls.gov/ooh/healthcare/home-health-aides-and-personal-care-aides.htm" },
          { role: "Financial Analysts", note: "Finance roles increasingly need privacy-aware data tooling for modeling and compliance.", url: "https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm" }
        ]
      },
      {
        title: "Multi-modal Simulation Sandbox",
        desc: "A web sandbox where learners prototype multimodal pipelines (text → image → audio) with realistic latency and observability dashboards to mirror production constraints.",
        assetType: "Sandbox / Prototype Environment",
        blsTargets: [
          { role: "Occupational Therapy Assistants / Allied Health", note: "Healthcare allied roles benefit from multimodal training (simulations, assistive tech).", url: "https://www.bls.gov/ooh/fastest-growing.htm" },
          { role: "Instructional Designers / Training Specialists", note: "Large demand to produce scenario-based content and on-the-job training.", url: "https://www.bls.gov/emp/" }
        ]
      },
      {
        title: "PromptOps & Continuous Tuning",
        desc: "Micro-modules teaching prompt versioning, A/B testing prompts, and operationalizing prompt performance metrics — treat prompts as code.",
        assetType: "Micro-module series / Tooling",
        blsTargets: [
          { role: "Market Research Analysts / Business Analysts", note: "Data and content roles that can use prompt ops to scale insights and content generation.", url: "https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm" },
          { role: "Customer Service / Call Center Supervisors", note: "Ops and quality roles that benefit from automated conversational tooling and evaluation.", url: "https://www.bls.gov/emp/" }
        ]
      },
      {
        title: "Immersive Case Studios",
        desc: "Scenario-based, narrative case studios (video + interactive tasks) that simulate cross-functional stakeholders: product, compliance, data, and ops.",
        assetType: "Immersive Case / Studio",
        blsTargets: [
          { role: "Project Managers / Program Coordinators", note: "Cross-functional coordination skills transfer into many sectors (healthcare, finance, services).", url: "https://www.bls.gov/emp/" },
          { role: "Compliance Officers / Risk Analysts", note: "Simulated cases are useful for compliance training and risk decision-making.", url: "https://www.bls.gov/emp/" }
        ]
      },
      {
        title: "Auto-Assessment Marketplace",
        desc: "A marketplace for validator scripts, rubric templates and micro-checks. Community-contributed validators speed up rollout and keep assessments current.",
        assetType: "Platform / Marketplace",
        blsTargets: [
          { role: "Training & Development Specialists", note: "Organizations need scalable assessment pipelines across many non-ICT roles.", url: "https://www.bls.gov/emp/" },
          { role: "Clinical Data Coordinators", note: "Data/assessment validators help standardize clinical competencies and documentation.", url: "https://www.bls.gov/emp/" }
        ]
      }
    ];

    return (
      <div className="tab-content reco-bg">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20 }}>Recommendations — Future-facing learning investments</div>
            <div style={{ color: "#64748b", marginTop: 6 }}>Prioritized, innovation-led initiatives mapped to employability targets (BLS projections).</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginTop: 16 }}>
          {cards.map((c, i) => (
            <div key={i} style={{ borderRadius: 12, padding: 16, background: "linear-gradient(180deg,#fff,#fbfdff)", boxShadow: "0 10px 30px rgba(6,12,30,0.04)", border: "1px solid rgba(11,22,65,0.04)" }}>
              <div style={{ fontWeight: 900, fontSize: 16 }}>{c.title}</div>
              <div style={{ color: "#475569", marginTop: 8 }}>{c.desc}</div>

              <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ fontWeight: 800, fontSize: 12 }}>Type of asset</div>
                <div style={{ padding: "6px 10px", borderRadius: 8, background: "#fff", border: "1px solid rgba(11,22,65,0.04)", fontWeight: 700 }}>{c.assetType}</div>
              </div>

              
              <div style={{ marginTop: 12 }}>
                <button style={{ padding: "8px 12px", borderRadius: 10, border: "none", background: "linear-gradient(90deg,var(--accent-A),var(--accent-B))", color: "#fff", fontWeight: 800, cursor: "pointer" }}>Add to Roadmap</button>
                <button style={{ padding: "8px 12px", marginLeft: 8, borderRadius: 10, border: "1px solid rgba(11,22,65,0.06)", background: "#fff", fontWeight: 700, cursor: "pointer" }}>Draft Pilot</button>
              </div>
            </div>
          ))}
        </div>       
      </div>
    );
  }


  const ContentStrategyPanel = (
    <div className="tab-content strategy-bg">
      <div style={{ fontSize: 18, fontWeight: 900 }}>Content Volume & Strategy</div>
      <div style={{ color: "#64748b", marginTop: 6 }}>Layer assessment, micro-modules and meta-learning onto SkillsBuild without heavy redevelopment.</div>

      <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
          <div style={{ fontWeight: 800 }}>Layer assessments (no-course-rewrite)</div>
          <div style={{ color: "#64748b", marginTop: 8 }}>Attach wrappers : Plan -> Build -> Reflect - to Learn modules, store standardized JSON submissions for automation.</div>
        </div>

        <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
          <div style={{ fontWeight: 800 }}>Micro-modules</div>
          <div style={{ color: "#64748b", marginTop: 8 }}>Create short spaced-repetition capsules, just-in-time help and scenario capsules for domains like Finance and Healthcare.</div>
        </div>

        <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
          <div style={{ fontWeight: 800 }}>Reuse-first strategy</div>
          <div style={{ color: "#64748b", marginTop: 8 }}>Standard templates, starter repos, and a uniform JSON submission schema reduce redevelopment effort and accelerate pilots.</div>
        </div>
      </div>
    </div>
  );


  return (
    <div className="app-wrap">
      <div className="container" role="main">
        {!program && (
          <div className="tab-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className="hero">
              <div>
                <div className="org">IBM SkillsBuild</div>
                <div className="org-sub">Upskill for the AI era</div>
              </div>

            </div>
            <div style={{ textAlign: "center" }}>
              <div className="page-title">Programs</div>
              <div className="page-sub">Choose a program to view curricula & assessment strategy</div>
            </div>

            <div className="programs">
              <button className={`prog-btn student ${program === "student" ? "active" : ""}`} onClick={() => { setProgram("student"); setActiveTab("map"); }}>Student Developer Program</button>
              <button className={`prog-btn fluency ${program === "fluency" ? "active" : ""}`} onClick={() => { setProgram("fluency"); setActiveTab("map"); }}>AI Fluency</button>
              <button className={`prog-btn ai4cs ${program === "ai4cs" ? "active" : ""}`} onClick={() => { setProgram("ai4cs"); setActiveTab("map"); }}>AI4CS</button>
              <button className={`prog-btn digi ${program === "digi" ? "active" : ""}`} onClick={() => { setProgram("digi"); setActiveTab("map"); }}>Digital Literacy</button>
              <button className={`prog-btn ailit ${program === "ailit" ? "active" : ""}`} onClick={() => { setProgram("ailit"); setActiveTab("map"); }}>AI Literacy</button>
              <button className={`prog-btn aifun1 ${program === "aifun1" ? "active" : ""}`} onClick={() => { setProgram("aifun1"); setActiveTab("map"); }}>AI Fundamentals I</button>
              <button className={`prog-btn aifun2 ${program === "aifun2" ? "active" : ""}`} onClick={() => { setProgram("aifun2"); setActiveTab("map"); }}>AI Fundamentals II</button>
            </div>
            <div style={{ color: "#64748b", marginTop: 8 }}>Tip: Click "Student Developer Program" to view the course map, evidence and content strategy prepared for student-facing curriculum.</div>

            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <div className="page-title">Enhancements, Opportunities & Recommendations</div>
              <div className="page-sub">Click to learn how to enhance the SkillsBuild experience</div>
            </div>

            <div className="programs">
              <button className={`prog-btn opportunity ${program === "opportunities" ? "active" : ""}`} onClick={() => { setProgram("opportunities"); setActiveTab("map"); }}>Enhancements & Opportunities</button>
              <button className={`prog-btn recommendation ${program === "recommendation" ? "active" : ""}`} onClick={() => { setProgram("recommendation"); setActiveTab("map"); }}>Recommendations</button>

            </div>
            {/* <div style={{ color: "#64748b", marginTop: 8 }}>Tip: Click "Student Developer Program" to view the course map, evidence and content strategy prepared for student-facing curriculum.</div> */}

          </div>
        )}

        {program === "opportunities" && (
          <div className="tab-content">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <button className="btn" onClick={() => setProgram(null)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>← Back</button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>Opportunities</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>AI augmentation opportunities & wrap strategy</div>
              </div>
            </div>

            <OpportunitiesView />
          </div>
        )}

        {program === "recommendation" && (
          <div className="tab-content">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <button className="btn" onClick={() => setProgram(null)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>← Back</button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>Recommendations</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Program design bundles & role-based AI augmentation recommendations</div>
              </div>
            </div>

            <RecommendationsProgramView />
          </div>
        )}


        {program === "student" && (

          <div>
            <div className="tab-content" style={{ paddingTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <button className="btn" onClick={() => { setProgram(null); setSelectedCourse(null); }} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>← Back</button>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 900 }}>Student Developer Program</div>
                    <div style={{ color: "#64748b", fontSize: 13 }}>IBM SkillsBuild — AI Content Map (Student track)</div>
                  </div>
                </div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Filters</div>
              </div>

              <div className="tabs" role="tablist">
                <div role="tab" className={`tab ${activeTab === "map" ? "active" : ""}`} onClick={() => setActiveTab("map")}>Content Map</div>
                <div role="tab" className={`tab ${activeTab === "evidence" ? "active" : ""}`} onClick={() => setActiveTab("evidence")}>Evidence of Skills Acquisition</div>
                <div role="tab" className={`tab ${activeTab === "strategy" ? "active" : ""}`} onClick={() => setActiveTab("strategy")}>Content Strategy</div>
                <div role="tab" className={`tab ${activeTab === "personas" ? "active" : ""}`} onClick={() => setActiveTab("personas")}>Personas</div>
                <div role="tab" className={`tab ${activeTab === "gaps" ? "active" : ""}`} onClick={() => setActiveTab("gaps")}>Opportunities</div>
                <div role="tab" className={`tab ${activeTab === "recommendations" ? "active" : ""}`} onClick={() => setActiveTab("recommendations")}>Recommendations</div>
              </div>
            </div>


            {activeTab === "map" && (
              <div className="tab-content">
                <div className="header-row">
                  <div style={{ flex: 1 }} />
                  <div className="controls">
                    <input type="text" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    <select value={personaFilter || ""} onChange={(e) => setPersonaFilter(e.target.value || null)}>
                      <option value="">All personas</option>
                      {PERSONAS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <button className="btn" onClick={() => { setPersonaFilter(null); setSearch(""); setSelectedCourse(null); }} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>Reset</button>
                  </div>
                </div>

                <div className="grid" aria-hidden={false}>
                  {TIERS.map((t) => (
                    <div key={t} className="column" data-tier={t}>
                      <div className="tier-title">{t}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {(grouped[t] || []).map((course) => <CourseCard key={course.id} course={course} />)}
                        {(grouped[t] || []).length === 0 && <div style={{ color: "#94a3b8", fontSize: 14 }}>No courses</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="details" style={{ marginTop: 18 }}>
                  <div className="gap-list">
                    <div className="gaps-title">Opportunities quick view</div>
                    <ul className="gaps-list">
                      <li><strong>Ethics:</strong> Expand ethics into Learn track with case labs.</li>
                      <li><strong>Domain:</strong> Add Learn level modules for Healthcare, Legal, Finance.</li>
                      <li><strong>Emerging:</strong> Add Vibe Coding, Prompt Engineering for Business.</li>
                    </ul>

                    {selectedComplement && MODULES[selectedComplement] && (
                      <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: "#fff7e6", border: "1px solid rgba(250,184,108,0.06)" }}>
                        <div style={{ fontWeight: 900 }}>{MODULES[selectedComplement].title}</div>
                        <div style={{ color: "#64748b", marginTop: 6 }}>{MODULES[selectedComplement].desc}</div>
                      </div>
                    )}
                  </div>

                  <div className="quick-panel">
                    <div className="card-large" style={{ padding: 12 }}>
                      <div style={{ fontWeight: 900 }}>Reviewer Queue</div>
                      <div style={{ color: "#64748b", marginTop: 8, marginBottom: 8 }}>Autograde runs from Evidence appear here. Assign reviewers, collect peer scores and inspect agreement.</div>

                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <button className="btn" onClick={() => sampleForExpertReview()} style={{ padding: "8px 12px", borderRadius: 8, background: "linear-gradient(90deg,var(--accent-A),var(--accent-B))", color: "#fff", border: "none", fontWeight: 800 }}>Sample for Expert Review</button>
                        <button className="btn" onClick={() => clearPortfolio()} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>Clear</button>
                      </div>

                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        <button className="btn" onClick={() => exportPortfolioCSV()} style={{ padding: "8px 12px", borderRadius: 8, background: "linear-gradient(90deg,var(--accent-A),var(--accent-B))", color: "#fff", border: "none", fontWeight: 800 }}>Export CSV</button>
                        <button className="btn" onClick={() => openPrintModalForPortfolio()} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>Print / PDF</button>
                      </div>

                      <div style={{ maxHeight: 300, overflow: "auto", paddingRight: 8 }}>
                        {portfolio.length === 0 && <div style={{ color: "#94a3b8" }}>No portfolio entries yet. Run a simulated autograde in Evidence.</div>}
                        {portfolio.map(entry => (
                          <div key={entry.id} style={{ marginBottom: 12, paddingBottom: 8, borderBottom: "1px dashed rgba(11,22,65,0.04)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <div>
                                <div style={{ fontWeight: 900 }}>{entry.submission.learnerId} • {entry.submission.submissionId}</div>
                                <div style={{ color: "#64748b", fontSize: 12 }}>{new Date(entry.ts).toLocaleString()}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontWeight: 900, color: entry.result.passed ? "#0b6d3a" : "#9b1232" }}>{entry.result.passed ? "PASS" : "REVIEW"}</div>
                                <div style={{ fontSize: 12, color: "#64748b" }}>{entry.result.combined} combined</div>
                              </div>
                            </div>

                            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                              <select onChange={(ev) => assignReviewerToEntry(entry.id, ev.target.value)} defaultValue="">
                                <option value="">Assign reviewer</option>
                                {REVIEWERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                              </select>
                              <button className="btn" style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }} onClick={() => setSelectedCourse({ title: `Submission ${entry.submission.submissionId}`, tier: "Submission", duration: "-", personas: [], entry })}>Open</button>
                              <button className="btn" style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }} onClick={() => setPortfolio(p => p.map(x => x.id === entry.id ? { ...x, expertSample: !x.expertSample } : x))}>{entry.expertSample ? "Unmark Expert" : "Mark Expert"}</button>
                            </div>

                            <div style={{ marginTop: 8 }}>
                              <div style={{ fontSize: 12, color: "#64748b" }}>Reviewers: {(entry.assignedReviewerIds || []).map(id => REVIEWERS.find(r => r.id === id)?.name).filter(Boolean).join(", ") || "—"}</div>
                              <div style={{ marginTop: 6, fontSize: 13 }}>Inter-rater agreement: {entry.agreementPercent ? `${entry.agreementPercent}%` : "N/A (need ≥2 reviews)"}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === "evidence" && (
              <div className="tab-content">
                <div className="evidence-bg card-large">
                  <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>Guide learners to showcase process</div>
                  <div style={{ color: "#64748b", marginBottom: 10 }}>Capture thinking, decisions and iterations — not just final outputs.</div>

                  <Collapsible title="Process Templates & Reflection Prompts" defaultOpen={true}>
                    <div style={{ display: "grid", gap: 12 }}>
                      {[{ n: "1", title: "Problem framing", desc: "Define goals, constraints, and success metrics" },
                      { n: "2", title: "Design decisions", desc: "Consider alternatives & trade-offs" },
                      { n: "3", title: "Implementation steps", desc: "Document code, tools, infra choices" },
                      { n: "4", title: "Validation & testing", desc: "Include metrics and edge cases" },
                      { n: "5", title: "Reflection", desc: "What worked, what failed, and what's next" }].map(it => (
                        <div key={it.n} style={{ display: "flex", gap: 12 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 14, background: "linear-gradient(90deg,var(--accent-A),var(--accent-B))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>{it.n}</div>
                          <div>
                            <div style={{ fontWeight: 800 }}>{it.title}</div>
                            <div style={{ color: "#425066" }}>{it.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Collapsible>

                  <Collapsible title="Checkpoints & Micro-Submissions">
                    <div style={{ background: "#fff", padding: 12, borderRadius: 8 }}>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>Recommended checkpoints</div>
                      <ul style={{ marginLeft: 18 }}>
                        <li>Problem brief</li>
                        <li>Data & architecture sketch</li>
                        <li>Prototype / notebook link</li>
                        <li>2–3 min demo + reflection</li>
                      </ul>
                    </div>
                  </Collapsible>
                </div>

                <div style={{ height: 18 }} />

                <div className="card-large">
                  <div style={{ fontSize: 18, fontWeight: 900 }}>JSON Submission Schema (example)</div>
                  <div style={{ color: "#64748b", marginTop: 6 }}>Standardized metadata for automation and AI-rubric scoring.</div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Schema (simplified)</div>
                    <pre className="schema">{JSON.stringify(JSON_SCHEMA, null, 2)}</pre>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Editable submission (paste or edit then run autograde)</div>
                    <textarea style={{ width: "100%", minHeight: 220, fontFamily: "monospace", padding: 10, borderRadius: 8 }} value={submissionText} onChange={(e) => setSubmissionText(e.target.value)} />
                  </div>

                  <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
                    <button className="simulate-btn" onClick={() => runAutogradeFromText(submissionText)} disabled={running}>{running ? "Running..." : "Run Autograde (LLM or mock)"}</button>
                    <button className="btn" onClick={() => setSubmissionText(JSON.stringify(exampleSubmission, null, 2))} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>Reset example</button>
                    <div style={{ color: "#64748b" }}>Autograde attempts an LLM scoring call; if unavailable, it falls back to mock scoring and saves the run to the Reviewer Queue.</div>
                  </div>

                  {autogradeResult && (
                    <div style={{ marginTop: 12, background: "#fbfbff", padding: 12, borderRadius: 10, border: "1px solid rgba(11,22,65,0.03)" }}>
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>Autograde result (source: {autogradeResult.source})</div>
                      <div style={{ display: "flex", gap: 18 }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>Rubric scores</div>
                          <ul style={{ marginLeft: 18 }}>
                            {Object.entries(autogradeResult.scores).map(([k, v]) => <li key={k}><strong>{k.replace("_", " ")}:</strong> {v} / 5</li>)}
                          </ul>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>Summary</div>
                          <div style={{ color: "#425066", marginBottom: 6 }}>Rubric average: {autogradeResult.rubricAvg.toFixed(2)} / 5</div>
                          <div style={{ color: "#425066", marginBottom: 6 }}>Repo score: {autogradeResult.repoScore} • Artifacts score: {autogradeResult.artifactsScore}</div>
                          <div style={{ marginTop: 6, fontWeight: 900, color: autogradeResult.passed ? "#0b6d3a" : "#9b1232" }}>{autogradeResult.passed ? "PASS" : "REVIEW (flagged)"} — combined: {autogradeResult.combined}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}


            {activeTab === "strategy" && <div className="tab-content">{ContentStrategyPanel}</div>}
            {activeTab === "personas" && <div>{PersonasView}</div>}
            {activeTab === "gaps" && <div>{GapsView()}</div>}
            {activeTab === "recommendations" && <div>{RecommendationsView()}</div>}

            <AnimatePresence>
              {selectedCourse && <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
              {printModal && printModal.type === "portfolio" && (
                <PrintModal title="Portfolio Snapshot (print/save as PDF)" onClose={() => setPrintModal(null)}>
                  <div>
                    <div style={{ fontWeight: 900, marginBottom: 8 }}>Portfolio snapshot — {portfolio.length} entries</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9" }}>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>submissionId</th>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>learner</th>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>courseId</th>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>combined</th>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>status</th>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>reviewers</th>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>agreement%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio.map((e) => (
                          <tr key={e.id}>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{e.submission.submissionId}</td>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{e.submission.learnerId}</td>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{e.submission.courseId}</td>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{e.result.combined}</td>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{e.result.passed ? "PASS" : "REVIEW"}</td>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{(e.assignedReviewerIds || []).map(id => REVIEWERS.find(r => r.id === id)?.name).filter(Boolean).join(", ")}</td>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{e.agreementPercent || ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </PrintModal>
              )}
              {printModal && printModal.type === "modules" && (
                <PrintModal title="Module Mappings (print/save as PDF)" onClose={() => setPrintModal(null)}>
                  <div>
                    <div style={{ fontWeight: 900, marginBottom: 8 }}>SkillsBuild Module Mappings</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9" }}>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>moduleId</th>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>title</th>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>lane</th>
                          <th style={{ padding: 8, border: "1px solid #eef6ff" }}>description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(MODULES).map(m => (
                          <tr key={m.id}>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{m.id}</td>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{m.title}</td>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{m.lane}</td>
                            <td style={{ padding: 8, border: "1px solid #eef6ff" }}>{m.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </PrintModal>
              )}
            </AnimatePresence>

            {showComplementPanel && selectedComplement && MODULES[selectedComplement] && (
              <div style={{ position: "fixed", right: 28, bottom: 28, zIndex: 1500 }}>
                <div style={{ background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 20px 50px rgba(6,12,30,0.2)", border: "1px solid rgba(11,22,65,0.06)" }}>
                  <div style={{ fontWeight: 900 }}>{MODULES[selectedComplement].title}</div>
                  <div style={{ color: "#64748b", marginTop: 8 }}>{MODULES[selectedComplement].desc}</div>
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <button className="btn" onClick={() => window.open(MODULES[selectedComplement].link || "#")} style={{ padding: "8px 12px", borderRadius: 8, background: "linear-gradient(90deg,var(--accent-A),var(--accent-B))", color: "#fff", border: "none", fontWeight: 800 }}>Open module</button>
                    <button className="btn" onClick={() => { setSelectedComplement(null); setShowComplementPanel(false); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>Clear</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {program === "fluency" && (
          <div className="tab-content">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <button className="btn" onClick={() => setProgram(null)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>← Back</button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>AI Fluency</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Placeholder — coming soon</div>
              </div>
            </div>
            <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
              <div style={{ fontWeight: 900 }}>Overview</div>
              <div style={{ color: "#64748b" }}>Placeholder for AI Fluency program content.</div>
            </div>
          </div>
        )}

        {program === "ai4cs" && (
          <div className="tab-content">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <button className="btn" onClick={() => setProgram(null)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>← Back</button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>AI4CS</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Placeholder — coming soon</div>
              </div>
            </div>
            <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
              <div style={{ fontWeight: 900 }}>Overview</div>
              <div style={{ color: "#64748b" }}>Placeholder for AI4CS program content.</div>
            </div>
          </div>
        )}

        {program === "digi" && (
          <div className="tab-content">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <button className="btn" onClick={() => setProgram(null)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>← Back</button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>Digital Literacy</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Placeholder — coming soon</div>
              </div>
            </div>
            <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
              <div style={{ fontWeight: 900 }}>Overview</div>
              <div style={{ color: "#64748b" }}>Placeholder for Digital Literacy program content.</div>
            </div>
          </div>
        )}

        {program === "ailit" && (
          <div className="tab-content">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <button className="btn" onClick={() => setProgram(null)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>← Back</button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>AI Literacy</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Placeholder — coming soon</div>
              </div>
            </div>
            <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
              <div style={{ fontWeight: 900 }}>Overview</div>
              <div style={{ color: "#64748b" }}>Placeholder for AI Literacy program content.</div>
            </div>
          </div>
        )}

        {program === "aifun1" && (
          <div className="tab-content">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <button className="btn" onClick={() => setProgram(null)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>← Back</button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>AI Fundamentals I</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Placeholder — coming soon</div>
              </div>
            </div>
            <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
              <div style={{ fontWeight: 900 }}>Overview</div>
              <div style={{ color: "#64748b" }}>Placeholder for AI Fundamentals I program content.</div>
            </div>
          </div>
        )}

        {program === "aifun2" && (
          <div className="tab-content">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <button className="btn" onClick={() => setProgram(null)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(11,22,65,0.06)" }}>← Back</button>
              <div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>AI Fundamentals II</div>
                <div style={{ color: "#64748b", fontSize: 13 }}>Placeholder — coming soon</div>
              </div>
            </div>
            <div style={{ background: "#fff", padding: 12, borderRadius: 10 }}>
              <div style={{ fontWeight: 900 }}>Overview</div>
              <div style={{ color: "#64748b" }}>Placeholder for AI Fundamentals II program content.</div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
