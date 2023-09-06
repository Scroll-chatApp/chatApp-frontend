import React, { useState, useEffect, useContext } from "react";
import { Data } from "./contextApi/UserData";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("http://localhost:8900");

const Messenger = () => {
  const [username, setUsername] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatStart, setChatStart] = useState(false);
  const { account } = useContext(Data);
  function startChat() {
    console.log("chat started");
    setChatStart(true);
    socket.emit("newUser", username);
  }

  function sendMessage() {
    if (to && message) {
      socket.emit("onMessage", { to, message });
      setMessage("");
    }
  }

  useEffect(() => {
    socket.on("user-connected", (username) => {
      console.log(`User connected: ${username}`);
    });

    socket.on("user-disconnected", (username) => {
      console.log(`User disconnected: ${username}`);
    });

    socket.on("onMessage", ({ from, message }) => {
      setMessages((prevMessages) => [...prevMessages, `${from}: ${message}`]);
    });

    return () => {
      socket.off("user-connected");
      socket.off("user-disconnected");
      socket.off("onMessage");
    };
  }, [socket]);

  return (
    <div>
      <input
        type="text"
        id="username"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={startChat}>Start Chat</button>

      {chatStart && (
        <div>
          <input
            placeholder="Enter the recipient's username"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <input
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
          <div>
            {messages.map((msg, index) => (
              <p key={index}>{msg}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Messenger;
