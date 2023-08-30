// TopBar.js
import React from "react";
import "./TopBar.css"; // Import the CSS file

const TopBar = ({ receiver }) => {
  return (
    <div className="topbar">
      <h1>{receiver}</h1>
    </div>
  );
};

export default TopBar;
