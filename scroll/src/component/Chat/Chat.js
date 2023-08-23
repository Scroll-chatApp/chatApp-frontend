import React, { useEffect, useState } from "react";
// import { user } from "../userJoin/Join.js";
import { user } from "../userJoin/join";
import socketIo from "socket.io-client";
let socket;
const ENDPOINT = "http://localhost:4500/";

const Chat = () => {
  const [messageToBeSend, setMessageToBeSend] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiveBy, setReceiveBy] = useState([]);
  const [receiverName, setReceiverName] = useState("");

  // function handleChange(event) {
  //   setMessageToBeSend(event.target.value);
  // }
  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });
    console.log("why here UP");

    socket.emit("userJoined", { user });

    socket.on("sendMessage", (messageData, sender) => {
      console.log(messageData, " ==>> message got from backend  ");
      console.log(sender, " say : ", messageData);
      setReceiveBy((prereceiveBy) => [...prereceiveBy, sender]);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const send = (event) => {
    event.preventDefault();
    const messageSend = messageToBeSend;
    console.log(messageSend);
    socket.emit("message", messageSend, receiverName, user);
    setMessageToBeSend("");
  };

  return (
    <div>
      <h1>{user} let's chat </h1> <br />
      Enter receiver name
      <input
        placeholder="Recciver name"
        value={receiverName}
        id="message"
        onChange={(e) => setReceiverName(e.target.value)}
      />{" "}
      <br />
      Enter message
      <input
        placeholder="Message"
        value={messageToBeSend}
        id="message"
        onChange={(e) => setMessageToBeSend(e.target.value)}
      />
      <br />
      <button onClick={send}>Send</button>
      <br />
      <div>
        Messages are:
        {messages?.map((msg, index) => (
          <div key={index}>
            <p>
              <strong>{receiveBy[index]}: </strong>
              {msg}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
