import React, { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import TopBar from "./TopBar/TopBar";
import ChatArea from "./ChatArea/ChatArea";
import "./Chat.css"; // Import the CSS file
import axios from "axios";

let socket;
const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API = axios.create({ baseURL: ENDPOINT });

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState({});
  const [sender, setSender] = useState({});

  const currentUser = localStorage.getItem("user");
  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.emit("userJoined", { user: currentUser });
    async function fetchUsers() {
      try {
        const response = await API.get(`/getallusers`);
        const fetchedUsers = response.data;
        const filteredUsers = fetchedUsers.filter((user) => {
          if (user.user_name === currentUser) {
            setSender(user);
            return false;
          } else {
            return true;
          }
        });
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h2>{currentUser} let's chat</h2>
        <ul>
          {users.map((user, _id) => (
            <li
              key={user._id}
              onClick={() => setReceiver(user)} // Update the selected user
            >
              {user.user_name}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-content">
        <TopBar receiver={receiver.user_name} />
        {receiver._id && (
          <ChatArea
            receiverId={receiver._id}
            senderId={sender._id}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
