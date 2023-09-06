// TopBar.js
import React from "react";
import "./TopBar.css"; // Import the CSS file

const TopBar = ({ username }) => {
  return (
    <div className="topbar">
      <h1>{username}'s Chat</h1>
    </div>
  );
};

export default TopBar;
