// src/components/ChatBot.js
import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Paper, Chip } from "@mui/material";
import axios from "axios";

// Watson Assistant configuration
const INSTANCE_ID = "e07afe50-d908-4fdf-bf5a-99ac45901a07";  // Your Watsonx instance ID
const API_KEY = "2iBdTRlKCGIwa5QoBx38Y0_8Gr8MmkulG3xqkwryjYWH";  // API Key

// Assistant IDs for multi-agent setup
const ASSISTANT_IDS = {
  customerSupport: "5745b428-4f20-4ce3-908e-ea8de718d28e",
  salesAgent: "349d44b0-b426-4d78-bac2-242cd37ea8cc",
  techSupport: "3b5c22b1-11fd-40e7-9985-5248bee318ff"
};

// Determine which Assistant to call based on message content
const getAssistantId = (message) => {
  const lowerMsg = message.toLowerCase();

  // ✅ Check if the message contains any numbers
  const containsNumber = /\d/.test(message);
  console.log("containsNumber = ", containsNumber)

  if (containsNumber) {
    // If any number is present, route to Customer Support
    return { id: ASSISTANT_IDS.customerSupport, name: "Customer Support" };
  }

  if (lowerMsg.includes("tech") || lowerMsg.includes("troubleshoot") || lowerMsg.includes("fix")) {
    return { id: ASSISTANT_IDS.techSupport, name: "Technical Support" };
  } 
  if (lowerMsg.includes("status") || lowerMsg.includes("track") || lowerMsg.includes("order status")) {
    return { id: ASSISTANT_IDS.customerSupport, name: "Customer Support" };
  }
  if (lowerMsg.includes("buy") || lowerMsg.includes("purchase") || lowerMsg.includes("order") || lowerMsg.includes("products")) {
    return { id: ASSISTANT_IDS.salesAgent, name: "Sales Agent" };
  }
  
  // Default to Customer Support
  return { id: ASSISTANT_IDS.customerSupport, name: "Customer Support" };
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [assistantName, setAssistantName] = useState("");

  // ✅ Add context state
  // const [context, setContext] = useState({});
  const [contexts, setContexts] = useState({
    customerSupport: {},
    salesAgent: {},
    techSupport: {}
  });

  // ✅ Fetch greeting message on chatbot load
useEffect(() => {
  const fetchGreeting = async () => {
    try {
      const response = await axios.post(
        `https://api.us-south.assistant.watson.cloud.ibm.com/instances/${INSTANCE_ID}/v2/assistants/${ASSISTANT_IDS.customerSupport}/message?version=2023-06-23`,
        {
          input: { message_type: "text", text: "" },  // Initial greeting message
          context: {}
        },
        {
          auth: { username: "apikey", password: API_KEY },
          headers: { "Content-Type": "application/json" }
        }
      );

      console.log("Greeting Response:", response);

      const newContext = response.data.context || {};
      setContexts((prev) => ({ ...prev, customerSupport: newContext }));

      const botReply = response.data.output.generic
        .map((item) => item.text)
        .join(" ");

      const greetingMessage = { sender: "bot", text: botReply };
      setMessages([greetingMessage]);

    } catch (error) {
      console.error("Error fetching greeting:", error);
      const errorMessage = { sender: "bot", text: "Failed to load greeting message. Please try again." };
      setMessages([errorMessage]);
    }
  };

  fetchGreeting();
}, []); 

  // Function to call Watson Assistant (Actions-based, no sessions)
  const callWatsonAssistant = async (message) => {
    const { id: assistantId, name } = getAssistantId(message);
    setAssistantName(name);

    try {
      console.log("message sent = ", message);
      const currentContext = contexts[name.toLowerCase().replace(/ /g, "")] || {};
      const response = await axios.post(
        `https://api.us-south.assistant.watson.cloud.ibm.com/instances/${INSTANCE_ID}/v2/assistants/${assistantId}/message?version=2023-06-23`,
        {
          input: { message_type: "text", text: message },
          context: currentContext
        },
        {
          auth: { username: "apikey", password: API_KEY },
          headers: { "Content-Type": "application/json" }
        }
      );
      console.log("response = ", response);

      // ✅ Update the context for the specific agent
    const newContext = response.data.context || {};
    setContexts((prev) => ({
      ...prev,
      [name.toLowerCase().replace(/ /g, "")]: newContext
    }));

      const botReply = response.data.output.generic
        .map((item) => item.text)
        .join(" ");
        
      return botReply || "I didn't understand that. 🤖";

    } catch (error) {
      console.error("Error communicating with Watson Assistant:", error);
      return "Error contacting assistant. Please try again.";
    }
  };

  // Handle sending message
  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: "user", text: input };
      setMessages((prev) => [...prev, userMessage]);

      const botReply = await callWatsonAssistant(input);

      const botMessage = { sender: "bot", text: botReply };
      setMessages((prev) => [...prev, botMessage]);

      setInput("");
    }
  };

  return (
    <Box
      sx={{
        width: "500px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: 3,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Multi-Agent ChatBot 🚀
      </Typography>

      {assistantName && (
        <Box sx={{ textAlign: "center", marginBottom: "10px" }}>
          <Chip label={`Routing to: ${assistantName}`} color="primary" />
        </Box>
      )}

      <Paper
        elevation={3}
        sx={{
          height: "350px",
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#fff",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                backgroundColor: msg.sender === "user" ? "#dcf8c6" : "#f1f1f1",
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Box sx={{ display: "flex", marginTop: "10px" }}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={sendMessage}
          sx={{ marginLeft: "10px" }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBot;
