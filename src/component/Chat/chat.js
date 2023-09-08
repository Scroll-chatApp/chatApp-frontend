import React, { useEffect, useState } from "react";
import socketIo from "socket.io-client";
import ChatArea from "./ChatArea/chatArea";
import TopBar from "./TopBar/topBar"
import { fetchAllUser } from "../../api";
import { ENDPOINT, userJoined } from "../../constant";
import "./chat.css"; // Import the CSS file

let socket;
const Chat = () => {
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState({});
  const [sender, setSender] = useState({});

  const currentUser = localStorage.getItem("user");
  
  console.log("User outside useeffect : ", currentUser);
  useEffect(() => {
    console.log("User before : ", currentUser);
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.emit(userJoined, { user: currentUser });
    console.log("User : ", currentUser);
    async function fetchUsers() {
      try {
        const fetchedUsers = await fetchAllUser();
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
  }, [currentUser]);

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h2>{currentUser} let's chat</h2>
        <ul>
          {users.map((user, user_name) => (
            <li
              key={user.user_name}
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
          <ChatArea sender={sender} socket={socket} receiver={receiver} />
        )}
      </div>
    </div>
  );
};

export default Chat;
