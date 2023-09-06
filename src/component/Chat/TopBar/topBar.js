// TopBar.js
import React from "react";
import "./topBar.css"; // Import the CSS file

const topBar = ({ receiver }) => {
  return (
    <div className="topbar">
      <h1>{receiver}</h1>
    </div>
  );
};

export default topBar;
