import React, { useEffect, useState } from "react";
import { user } from "../Join/Join";
import socketIo from "socket.io-client";

const ENDPOINT = "http://localhost:4500/";

const Chat = () => {
  const socket = socketIo(ENDPOINT, { transports: ["websocket"] });
  useEffect(() => {
    socket.on("connect", () => {
      // alert("connected");
    });
  }, [socket]);
  const [messages, setMessages] = useState([]);
  const send = () => {
    const messageData = document.getElementById("message").value;
    console.log(messageData);
    socket.emit("message", messageData);
    document.getElementById("message").value = "";
  };

  socket.on("sendMessage", (messageData) => {
    console.log(messageData, " ==>> message got from back  ");

    setMessages((prevMessages) => [...prevMessages, messageData]);
  });

  return (
    <div>
      <h1>{user} let's chat </h1>
      <input placeholder="Message" id="message" />
      <button onClick={send}>Send</button>
      {messages?.map((msg, index) => (
        <div key={index}>
          <p>{msg}</p>
        </div>
      ))}
    </div>
  );
};

export default Chat;
