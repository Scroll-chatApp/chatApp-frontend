import React, { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import Sidebar from "./SideBar/SideBar";
import { user } from "../userJoin/Join.js";
import TopBar from "./TopBar/TopBar";
import ChatArea from "./ChatArea/ChatArea";
import "./Chat.css"; // Import the CSS file
let socket;
const ENDPOINT = "http://localhost:4500/";

const Chat = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });
    console.log("here");
    socket.emit("userJoined", { user });

    socket.on("addNewUser", (newUser) => {
      console.log("new user", newUser);
      setUsers((prevUsers) => [...prevUsers, newUser]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <div className="chat-container">
      <Sidebar users={users} />
      <div className="chat-content">
        <TopBar username={user} />
        <ChatArea />
      </div>
    </div>
  );
};

export default Chat;
