import React, { useEffect, useRef, useState } from "react";
import "./chatArea.css"; // Import the CSS file
import {
  conversationIdFetch,
  createNewConversation,
  fetchAllMessages,
} from "../../../api";
import {
  fileSend,
  messageSend,
  receiverMessage,
  senderMessage,
} from "../../../constant";
import PDFViewer from "./pdfView";

const ChatArea = ({ sender, socket, receiver }) => {
  const [messageToSend, setMessageToSend] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState();
  const messagesEndRef = useRef();

  useEffect(() => {
    if(messages){
      async function fetchMessage() {
        try {
          const fetchedConversation = await conversationIdFetch(
            receiver._id,
            sender._id
          );
  
          if (!fetchedConversation) {
            const createConversation = await createNewConversation(
              receiver._id,
              sender._id
            );
            const conversationId = createConversation;
            setConversationId(conversationId);
            setMessages([]);
          } else {
            const conversationId = fetchedConversation._id;
            setConversationId(conversationId);
  
            const fetchedMessage = await fetchAllMessages(conversationId);
            setMessages(fetchedMessage);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
          // Handle any other errors as needed
          setMessages([]);
        }
    }
    
    fetchMessage();
    }

  });

  const sendMessage = (messageToBeSend, type) => {
    if (type === "text" && !messageToBeSend.trim()) {
      return;
    }  
    if (!messageToBeSend) {
      return;
    }

    const { user_name: receiverName } = receiver;
    const { _id: senderId } = sender;
    if (type === "text") {
      socket.emit(messageSend, {
        messageToBeSend,
        type,
        senderId,
        conversationId,
        receiverName,
      });
      setMessageToSend("");
    } else {
      socket.emit(fileSend, {
        messageToBeSend,
        type,
        senderId,
        conversationId,
        receiverName,
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      sendMessage(selectedFile, "pdf");
    }
  };

  const handleFileChangePic = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      sendMessage(selectedFile, "pic");
    }
  };

  useEffect(() => {
    socket.on(receiverMessage, (incomingMessage) => {
      const newMessage = {
        message_data: incomingMessage.message_data,
        message_type: incomingMessage.message_type,
        sender_id: incomingMessage.sender_id,
        createdAt: incomingMessage.createdAt,
        _id:incomingMessage._id,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on(senderMessage, (incomingMessage) => { 
      const newMessage = {
      message_data: incomingMessage.message_data,
      message_type: incomingMessage.message_type,
      sender_id: incomingMessage.sender_id,
      createdAt: incomingMessage.createdAt,
      _id:incomingMessage._id,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, [socket]);

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
                  className={`message ${
                    msg.message_type === "pic"
                      ? msg.sender_id === sender._id
                        ? "sender"
                        : "receiver"
                      : msg.sender_id === sender._id
                      ? "sender message-sender-color"
                      : "receiver message-receiver-color"
                  }`}
                >
                  {msg.message_type === "text" ? (
                    <p className="message-text">{msg.message_data}</p>
                  ) : (
                    <div>
                      {msg.message_type === "pdf" ? (
                        // If message_data is a PDF, show a link to download pdf
                        <PDFViewer pdfUrl={msg.message_data} />
                      ) : (
                        // If message_data is not a PDF, show an image
                        <img
                          className="message-img"
                          src={msg.message_data}
                          alt={msg.sender_name + " Picture"}
                        />
                      )}
                    </div>
                  )}
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
        <div className="text-input">
          <input
            placeholder="Message"
            value={messageToSend}
            onChange={(e) => {
              setMessageToSend(e.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage(messageToSend, "text");
              }
            }}
          />

          <button onClick={() => sendMessage(messageToSend, "text")}>
            Send
          </button>
        </div>
        <div className="upload-container">
          <label className="file-upload-label">
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <div className="file-upload-icon">Upload PDF</div>
          </label>

          <label className="file-upload-label">
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              onChange={handleFileChangePic}
            />
            <div className="file-upload-icon">Upload Image</div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
