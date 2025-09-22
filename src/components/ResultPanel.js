import React from "react";

function ResultPanel({ result }) {
    if (!result) return <div className="result-panel">Results will appear here.</div>;

    console.log("Frontend result received:", result);
    return (
        <div className="result-panel">
            <h2>📄 Case Summary</h2>
            <p><strong>Entities:</strong> {result.entities?.join(", ")}</p>
            <p><strong>Keywords:</strong> {result.keywords?.join(", ")}</p>
            <p><strong>Laws Found:</strong> {result.laws?.join(", ")}</p>
            <h3>📚 Summary</h3>
            <p>{result.summary}</p>
            <h3>🔍 Prediction</h3>
            <p>{result.prediction}</p>
        </div>
    );
}

export default ResultPanel;
