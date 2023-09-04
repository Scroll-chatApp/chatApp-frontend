// ChatArea.js
import React, { useEffect, useRef, useState } from "react";
import "./chatArea.css"; // Import the CSS file
import {
  conversationIdFetch,
  createNewconversation,
  fetchAllMessages,
} from "../../../api";
import { messageSend, receiverMessage } from "../../../constant";

const ChatArea = ({ sender, socket, receiver }) => {
  const [messageToSend, setMessageToSend] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState();
  const [reload, setReload] = useState(true);
  const messagesEndRef = useRef();

  useEffect(() => {
    async function fetchMessage() {
      try {
        const fetchedConversation = await conversationIdFetch(
          receiver._id,
          sender._id
        );
        const conversationId = fetchedConversation._id;
        setConversationId(conversationId);

        const fetchedMessage = await fetchAllMessages(conversationId);
        setMessages(fetchedMessage);
      } catch (error) {
        const createConversation = await createNewconversation(
          receiver._id,
          sender._id
        );

        if (createConversation) {
          const fetchedConversation = await conversationIdFetch(
            receiver._id,
            sender._id
          );
          const conversationId = fetchedConversation._id;
          setConversationId(conversationId);
        }

        setMessages([]);
      }
    }

    fetchMessage();
  }, [sender._id, receiver._id, reload]);

  const sendMessage = () => {
    if (messageToSend.trim() === "") {
      return;
    }

    const type = "text";
    const receiverName = receiver.user_name;
    const senderId = sender._id;
    socket.emit(messageSend, {
      messageToSend,
      type,
      senderId,
      conversationId,
      receiverName,
    });
    setReload(!reload);
    setMessageToSend("");
  };

  useEffect(() => {
    socket.on(receiverMessage, () => {
      setReload(!reload);
    });
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                  ref={messagesEndRef}
                  className={`message  ${
                    msg.sender_id === sender._id ? "sender" : "receiver"
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
          onChange={(e) => {
            setMessageToSend(e.target.value);       
           }}
           onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        
        <button onClick={sendMessage} >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
