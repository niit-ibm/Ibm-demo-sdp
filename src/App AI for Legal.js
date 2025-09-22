import React, { useState } from "react";
import ChatPanel from "./components/ChatPanel";
import ResultPanel from "./components/ResultPanel";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuerySubmit = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("http://localhost:5000/legal/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      console.log("data = ", data)
      setResult(data);
    } catch (error) {
      console.error("Error fetching analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResult(null);
  };


  return (
    <div className="app-container">
      <h1>Legal Assistant Bot</h1>
      <div className="panels">
        <ChatPanel
          query={query}
          setQuery={setQuery}
          onSubmit={handleQuerySubmit}
          onClear={handleClear}
          loading={loading}
        />
        <ResultPanel result={result} />
      </div>
    </div>
  );
}

export default App;
