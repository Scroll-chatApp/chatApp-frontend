// ChatArea.js
import React, { useEffect, useState } from "react";
import "./ChatArea.css"; // Import the CSS file
import axios from "axios";

const ENDPOINT = process.env.REACT_APP_ENDPOINT;
const API = axios.create({ baseURL: ENDPOINT });

const ChatArea = ({ receiverId, senderId, socket }) => {
  const [messageToSend, setMessageToSend] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSend, setIsSend] = useState();
  const [conversationId, setConversationId] = useState();
  const [reload, setReload] = useState(0);

  useEffect(() => {
    async function fetchMessage() {
      try {
        const conversation = await API.get(
          `/getallconversationofuser/${senderId}/${receiverId}`
        );
        const fetchedConversation = conversation.data;
        const conversationId = fetchedConversation._id;
        setConversationId(conversationId);

        const response = await API.get(`/getmessage/${conversationId}`);
        const fetchedMessage = response.data;
        setMessages(fetchedMessage);
      } catch (error) {
        console.error("Error fetching message:", error);
        setMessages([]);
      }
    }

    fetchMessage();
  }, [senderId, receiverId, reload]);

  useEffect(() => {
    setIsSend(messageToSend.trim() !== "");
  }, [messageToSend]);

  const sendMessage = () => {
    if (messageToSend.trim() === "") {
      return;
    }

    const type = "text";
    socket.emit("sendMessage", {
      messageToSend,
      type,
      senderId,
      conversationId,
    });
    setReload(reload + 1);
    setMessageToSend("");
    setIsSend(false);
  };

  return (
    <div className="chat-area">
      <div className="messages">
        {messages.length === 0 ? (
          <p className="empty-messages">Let's chat with scroll</p>
        ) : (
          messages.map((msg, _id) => {
            const messageDate = new Date(msg.createdAt);
            const previousMessage = messages[_id - 1];
            const previousMessageDate = previousMessage
              ? new Date(previousMessage.createdAt)
              : null;
            const showDate =
              !previousMessageDate ||
              messageDate.toDateString() !== previousMessageDate.toDateString();

            return (
              <div key={_id}>
                <div className="date-container">
                  {showDate && (
                    <p className="date">{messageDate.toDateString()}</p>
                  )}
                </div>

                <div
                  className={`message  ${
                    msg.sender_id === senderId ? "sender" : "receiver"
                  }`}
                >
                  <p className="message-text">{msg.message_data}</p>
                  <p className="time">
                    {messageDate.toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="input-area">
        <input
          placeholder="Message"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
        />
        <button onClick={sendMessage} disabled={!isSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
