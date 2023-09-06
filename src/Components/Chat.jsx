import React, {useState, useEffect, useContext} from "react";
import Conversation from "./Conversation/Conversation";
import Message from "./Message/Message";
import { Data } from "./contextApi/UserData";
import socketIOClient from "socket.io-client";
import axios from "axios";
import "./Chat.css";


const socket = socketIOClient("http://localhost:8900");
const Chat = () => {
  const [username, setUsername] = useState("");
  const [to, setTo] = useState("");
  const [currentChat, setCurrentChat]=useState(null);
  const [currentMessages, setCurrentMessages]=useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers]=useState([]);
  const [chatStart, setChatStart] = useState(false);
  const { account } = useContext(Data);
  function startChat(receiverId) {
    console.log("chat started");
    console.log("receiver", receiverId);
    console.log("sender", account._id);
    socket.emit("newUser", account._id);
  }

  async function sendMessage()  { 
    const messageToSend={
      sender:account._id,
      receiver:currentChat,
      text:newMessage
    }
    console.log("going message", messageToSend);
    // try {
    //   axios.post("http://localhost:4000/message/create", messageToSend);
    //   setCurrentMessages([...currentMessages, messageToSend]);
    // } catch (error) {
    //   console.log(error);
    // }
    console.log("receiver", currentChat);
    console.log("sender", account._id);
    if (currentChat && newMessage) {
      socket.emit("onMessage", { currentChat, newMessage });
      setNewMessage("");
    }
  }
  useEffect(() => {
    async function getUsers(){
      console.log("logedin user", account);
      let res= await axios.get("http://localhost:4000/users/all");
      console.log("respnse", res.data)
      setUsers(res.data);
    }
    socket.emit("newUser", username);

    socket.on("user-connected", (username) => {
      console.log(`User connected: ${username}`);
    });

    socket.on("user-disconnected", (username) => {
      console.log(`User disconnected: ${username}`);
    });

    socket.on("onMessage", ({ from, message }) => {
      setMessages((prevMessages) => [...prevMessages, `${from}: ${message}`]);
    });
    getUsers();
    return () => {
      socket.off("user-connected");
      socket.off("user-disconnected");
      socket.off("onMessage");
    };
  }, [socket]);
  useEffect(()=>{
    const getMessages=async()=>{
      try {
        console.log("currentChat", currentChat);
        console.log("logedIn User", account._id)
        let response = await axios.get(`http://localhost:4000/message/all?sender=${account._id}&receiver=${currentChat}`);
        console.log("messages Response", response)
        setCurrentMessages(response.data);
      } catch (error) {
        console.log("error", error);
      }
    }
    getMessages();
  },[currentChat])
  useEffect(() => {
    // Scroll to the bottom of the chat box when messages change
    const chatBox = document.querySelector(".chatBoxTop");
    chatBox.scrollTop = chatBox.scrollHeight;
  }, [currentMessages]);
  console.log(currentMessages)
  return (
    <div className="chat">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input
            type="text"
            placeholder="Search for Chat.."
            className="searchChat"
          />
          {
            users.map((user)=>{
               return <div onClick={()=>{setCurrentChat(user._id); startChat(user._id)}} key={user._id}>
                <Conversation user={user}/>
               </div>
            })
          }
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
          <div className="chatBoxTop">
            {
              currentMessages.length===0?<p>No messages in this chat</p>:currentMessages.map((msg)=>(
                <Message currentMessage={msg} own={msg.sender===account._id} key={msg}/>
              ))
            }
          </div>
          <div className="chatBoxBottom">
            <textarea
              className="chatMessageInput"
              placeholder="Write Something here..."
              value={newMessage}
              onChange={(e)=>setNewMessage(e.target.value)}
            ></textarea>
            <button className="sendChatButton" onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;