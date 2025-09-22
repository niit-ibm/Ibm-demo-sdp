import axios from "axios";

const INSTANCE_ID = "e07afe50-d908-4fdf-bf5a-99ac45901a07";
const API_KEY = "2iBdTRlKCGIwa5QoBx38Y0_8Gr8MmkulG3xqkwryjYWH";
const ASSISTANT_ID = "349d44b0-b426-4d78-bac2-242cd37ea8cc";  // Sales Agent ID

export const SalesAgent = async (message, context = {}) => {
  try {
    const response = await axios.post(
      `https://api.us-south.assistant.watson.cloud.ibm.com/instances/${INSTANCE_ID}/v2/assistants/${ASSISTANT_ID}/message?version=2023-06-23`,
      {
        input: { message_type: "text", text: message },
        context: {}
      },
      {
        auth: { username: "apikey", password: API_KEY },
        headers: { "Content-Type": "application/json" }
      }
    );
    // ✅ Extract intents and context properly
    const intents = response.data.output.intents || [];
    const newContext = response.data.context || {};
    const botReply = response.data.output.generic
      .map((item) => item.text)
      .join(" ");

    return {
      text: botReply,
      context: newContext,
      intents: intents
    };

  } catch (error) {
    console.error("Sales Agent Error:", error);
    return { text: "Error contacting Sales Agent.", context: {}, intents: [] };
  }
};
