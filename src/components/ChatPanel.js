import React from "react";

function ChatPanel({ query, setQuery, onSubmit, onClear, loading }) {
    return (
        <div className="chat-panel">
            <h2>🗣️ Ask your legal question</h2>
            <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="E.g., I was fined for using a mobile while driving..."
                rows={6}
            />
            <button onClick={onSubmit} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze"}
            </button>
            <button onClick={onClear} disabled={loading} style={{ marginLeft: "380px" }} className="clear-button">
                Clear
            </button>
        </div>
    );
}

export default ChatPanel;
