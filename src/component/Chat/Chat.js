import React, { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import Sidebar from "./SideBar/SideBar";
import { user } from "../userJoin/Join.js";
import TopBar from "./TopBar/TopBar";
import ChatArea from "./ChatArea/ChatArea";
import "./Chat.css"; // Import the CSS file
import axios from "axios";

let socket;
const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API = axios.create({ baseURL: `http://localhost:4500/` });

const Chat = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.emit("userJoined", { user });
    socket.on("scoketid", (id) => {
      console.log(id);
    });

    socket.on("addNewUser", (newUser) => {
      console.log("new user", newUser);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await API.get(`/getallusers`);
        const fetchedUsers = response.data;
        const filteredUsers = fetchedUsers.filter(
          ({ user_name }) => user_name !== user
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);
  return (
    <div className="chat-container">
      <Sidebar Users={users} />
      <div className="chat-content">
        <TopBar username={user} />
        <ChatArea />
      </div>
    </div>
  );
};

export default Chat;
