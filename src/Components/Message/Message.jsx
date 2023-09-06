import React from "react";
import "./Message.css";
const Message = ({ currentMessage, own }) => {
  console.log("coming", currentMessage)
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <p className="messageText">
          {currentMessage.text}
        </p>
      </div>
      <div className="messageBottom">Time</div>
    </div>
  );
};

export default Message;
