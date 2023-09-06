// ChatArea.js
import React, { useEffect, useState } from "react";
import "./ChatArea.css"; // Import the CSS file
import axios from "axios";

const API = axios.create({ baseURL: `http://localhost:4500/` });

const ChatArea = () => {
  const [messageToSend, setMessageToSend] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    async function fetchMessage() {
      try {
        const response = await API.get(
          `/getmessage/${"64ed9d3cc28c30dc4ca83f0a"}`
        );
        const fetchedMessage = response.data;
        setMessages(fetchedMessage);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    }
    fetchMessage();
  }, []);

  return (
    <div className="chat-area">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <p>
              <strong>{msg.message_data}: </strong>
            </p>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          placeholder="Message"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
        />
        <button>Send</button>
      </div>
    </div>
  );
};

export default ChatArea;
