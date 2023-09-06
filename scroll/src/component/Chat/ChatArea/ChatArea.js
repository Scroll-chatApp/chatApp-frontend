// ChatArea.js
import React, { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import "./ChatArea.css"; // Import the CSS file
let socket;
const ENDPOINT = "http://localhost:4500/";

const ChatArea = () => {
  const [messageToSend, setMessageToSend] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiveBy, setReceiveBy] = useState([]);
  // const [receiverName, setReceiverName] = useState("");
  //const [users, setUsers] = useState([]);
  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.on("sendMessage", (messageData, sender) => {
      setReceiveBy((prevReceiveBy) => [...prevReceiveBy, sender]);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });
    socket.on("addNewUser", (newUser) => {
      console.log("new user", newUser);
      // setUsers((prevUsers) => [...prevUsers, newUser]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // const onsend = (event) => {
  //   event.preventDefault();
  //   socket.emit("message", messageToSend);
  //   setMessageToSend("");
  // };

  return (
    <div className="chat-area">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index}>
            <p>
              <strong>{receiveBy[index]}: </strong>
              {msg}
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
