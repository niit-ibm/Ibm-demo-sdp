// src/App.js
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import "./App.css";

export default function App() {
  const proficiencyData = [
    { month: "Jan", skill: 50 },
    { month: "Feb", skill: 60 },
    { month: "Mar", skill: 70 },
    { month: "Apr", skill: 80 },
    { month: "May", skill: 90 }
  ];

  const decayData = [
    { days: 0, level: 100 },
    { days: 30, level: 80 },
    { days: 60, level: 60 },
    { days: 90, level: 40 },
    { days: 120, level: 25 }
  ];

  const competencies = [
    { skill: "React", validation: ["Certification", "Project", "Peer Review"] },
    { skill: "Python", validation: ["Assessment", "Hackathon"] }
  ];

  const internships = [
    { state: "California", role: "Data Intern", link: "#" },
    { state: "Texas", role: "AI Apprentice", link: "#" },
    { state: "New York", role: "Cloud Intern", link: "#" }
  ];

  const growthData = [
    { role: "AI Engineer", growth: 28 },
    { role: "Cyber Analyst", growth: 22 },
    { role: "Cloud Architect", growth: 19 }
  ];

  const demandData = [
    { skill: "Python", demand: 95 },
    { skill: "AWS", demand: 88 },
    { skill: "React", demand: 78 },
    { skill: "Kubernetes", demand: 65 }
  ];

  return (
    <div className="container">
      <h1 className="main-title">Skills Intelligence Dashboards</h1>

      {/* Proficiency Dashboard */}
      <div className="card">
        <h2 className="card-title"> Proficiency Over Time</h2>
        <LineChart width={700} height={300} data={proficiencyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} label={{ value: "Skill %", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="skill" stroke="#4f46e5" strokeWidth={3} />
        </LineChart>
      </div>

      {/* Skill Decay Model */}
      <div className="card">
        <h2 className="card-title"> Skills Decay Modeling</h2>
        <AreaChart width={700} height={300} data={decayData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="days" label={{ value: "Days Since Last Use", position: "insideBottom", offset: -5 }} />
          {/* <XAxis dataKey="days" /> */}
          <YAxis label={{ value: "Proficiency %", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Area type="monotone" dataKey="level" stroke="#10b981" fill="#a7f3d0" strokeWidth={2} />
        </AreaChart>
      </div>

      {/* Competency Validation */}
      <div className="card">
        <h2 className="card-title"> Competency Validation Options</h2>
        <ul>
          {competencies.map((c, idx) => (
            <li key={idx} className="competency-item">
              <h3>{c.skill}</h3>
              <div className="badge-container">
                {c.validation.map((v, i) => (
                  <span key={i} className="badge">{v}</span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Internship Opportunities */}
      <div className="card">
        <h2 className="card-title"> Internship Opportunities</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>📍 State</th>
              <th>👨‍💼 Role</th>
              <th>🔗 Apply</th>
            </tr>
          </thead>
          <tbody>
            {internships.map((item, idx) => (
              <tr key={idx}>
                <td>{item.state}</td>
                <td>{item.role}</td>
                <td><a href={item.link} className="apply-link">Apply</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Job Family Growth */}
      <div className="card">
        <h2 className="card-title"> Job Family Growth Projections</h2>
        <BarChart width={700} height={300} data={growthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="role" />
          <YAxis unit="%" label={{ value: "Growth %", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="growth" fill="#6366f1" barSize={40} radius={[10, 10, 0, 0]} />
        </BarChart>
      </div>

      {/* Skill Demand Heatmap */}
      <div className="card">
        <h2 className="card-title"> Market Demand for Skills</h2>
        <ul className="demand-list">
          {demandData.map((item, idx) => (
            <li key={idx} className="demand-item">
              <span className="demand-skill">{item.skill}</span>
              <div className="demand-bar-bg">
                <div className="demand-bar-fill" style={{ width: `${item.demand}%` }}>{item.demand}%</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
