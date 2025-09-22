import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Chip } from "@mui/material";
import { CustomerSupportAgent } from "../agents/CustomerSupportAgent";
import { SalesAgent } from "../agents/SalesAgent";
import { TechnicalSupportAgent } from "../agents/TechnicalSupportAgent";

// ✅ Helper function to determine agent by keyword
const getAgentByKeyword = (responseText) => {
  console.log("🔍 Checking keywords in response:", responseText);

  if (responseText.includes("[tech_support]")) {
    return { agent: TechnicalSupportAgent, name: "Tech Support" };
  }
  if (responseText.includes("[sales_agent]")) {
    return { agent: SalesAgent, name: "Sales Agent" };
  }
  if (responseText.includes("[customer_support]")) {
    return { agent: CustomerSupportAgent, name: "Customer Support" };
  }

  // Default to Customer Support
  return { agent: CustomerSupportAgent, name: "Customer Support" };
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [assistantName, setAssistantName] = useState("Customer Support");

  // ✅ Store agent-specific context
  const [agentContext, setAgentContext] = useState({
    "Customer Support": {},
    "Tech Support": {},
    "Sales Agent": {}
  });

  const [currentAgent, setCurrentAgent] = useState("Customer Support");

  // ✅ Function to send message and handle inter-agent communication
  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);
      console.log("userMessage = ", userMessage);

      try {
        // ✅ Determine the current agent by message content
        const { agent, name } = getAgentByKeyword(input);
        console.log(`🔀 Routing to: ${name}`);

        let contextToUse = agentContext[name] || {};

        // ✅ Handle agent switching
        if (currentAgent !== name) {
          console.log(`🔁 Switching to new agent: ${name}`);

          // ✅ Save the current agent's context before switching
          setAgentContext((prev) => ({
            ...prev,
            [currentAgent]: contextToUse
          }));

          // ✅ Use the new agent's context (or reset if empty)
          contextToUse = agentContext[name] || {};
          setCurrentAgent(name);          // ✅ Update the current agent
        }

        // ✅ Call the agent with the existing context
        const { text, context: newContext } = await agent(input, contextToUse);

        // ✅ Merge new context with existing context for the same agent
        const mergedContext = {
          ...contextToUse,       // ✅ Keep previous context
          ...newContext          // ✅ Merge with new response context
        };

        // ✅ Save merged context per agent
        setAgentContext((prev) => ({
          ...prev,
          [name]: mergedContext
        }));

        // ✅ Display the response
        setMessages((prev) => [...prev, { sender: "bot", text }]);
        setAssistantName(name);

      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [...prev, { sender: "bot", text: "Error contacting assistant." }]);
      }

      setInput("");
    }
  };

  return (
    <Box sx={{ width: "500px", margin: "20px auto", padding: "20px", borderRadius: "8px", boxShadow: 3, backgroundColor: "#f9f9f9" }}>
      <Typography variant="h5" align="center" gutterBottom>Multi-Agent ChatBot 🚀</Typography>

      <Chip label={`Routing to: ${assistantName}`} color="primary" sx={{ marginBottom: "10px" }} />

      <Paper sx={{ height: "350px", overflowY: "auto", padding: "10px", backgroundColor: "#fff" }}>
        {messages.map((msg, index) => (
          <Typography key={index} sx={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "5px 0" }}>{msg.text}</Typography>
        ))}
      </Paper>

      <Box sx={{ display: "flex", marginTop: "10px" }}>
        <TextField fullWidth value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
        <Button variant="contained" onClick={sendMessage} sx={{ marginLeft: "10px" }}>Send</Button>
      </Box>
    </Box>
  );
};

export default ChatBot;
