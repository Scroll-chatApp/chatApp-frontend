// Sidebar.js
import React from "react";
import "./SideBar.css"; // Import the CSS file

const SideBar = ({ users }) => {
  return (
    <div className="sidebar">
      <h2>Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
