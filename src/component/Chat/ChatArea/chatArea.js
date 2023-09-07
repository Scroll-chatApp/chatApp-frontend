// ChatArea.js
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
  const [fileToSend, setFileToSend] = useState(null); // New state for selected file
  const [fileType, setFileType] = useState("text"); // New state for file type
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
        const createConversation = await createNewConversation(
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
    if (messageToSend.trim() === "" && !fileToSend) {
      return;
    }

    const type = fileToSend !== "text" ? fileType : "text";
    const {user_name : receiverName} = receiver;
    const {_id : senderId} = sender;

    if (type === "text") {
      socket.emit(messageSend, {
        messageToSend,
        type,
        senderId,
        conversationId,
        receiverName,
      });
      setMessageToSend("");
    } else {
      socket.emit(fileSend, {
        fileToSend,
        type,
        senderId,
        conversationId,
        receiverName,
      });
      setFileToSend(null);
    }
    setFileType("text");
    setReload(!reload);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileToSend(selectedFile);
      setFileType("pdf");
    }
  };

  const handleFileChangePic = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileToSend(selectedFile);
      setFileType("pic");
    }
  };

  useEffect(() => {
    socket.on(receiverMessage, () => {
      console.log("at receiver message");
      setReload(!reload);
    });

    socket.on(senderMessage, () => {
      setReload(!reload);
    });
  }, [socket, reload]);

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
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage}>Send</button>
        </div>
        <div className="upload-container">
          <label className="file-upload-label">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
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
          <span className="selected-file-type">{`Chat mode: ${fileType}`}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
