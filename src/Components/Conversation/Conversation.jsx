import React from 'react'
import "./Conversation.css"

const Conversation = ({user}) => {
  return (
    <div className="conversation">
      <span className="conversationName">{user.username}</span>
    </div>
  )
}

export default Conversation;