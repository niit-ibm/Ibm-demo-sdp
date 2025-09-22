import axios from 'axios';
import jsonData from '../data/wimbledon_round_stats_aligned.json';

const FLASK_API_URL = "http://localhost:5000/score";

export default async function WimbledonBot(userInput, chatHistory) {
  try {
    const response = await axios.post(FLASK_API_URL, {
      user_input: userInput,
      // match_data: jsonData,
      chat_history: chatHistory
    });

    // console.log("response = ", response);
    return {
      role: 'watsonx',
      content: response.data?.reply || "No response from server."
    };
  } catch (error) {
    console.error("Flask API error:", error);
    return {
      role: 'watsonx',
      content: "Unable to fetch response from backend at the moment."
    };
  }
}
