import React from "react";
import { Link } from "react-router-dom";

let user;
const Join = () => {
  const sendUser = () => {
    user = document.getElementById("username").value;
  };
  return (
    <div>
      <h1>hello from join</h1>
      <input placeholder="Enter" id="username" />
      <Link to="/chat">
        <button onClick={sendUser}>Let's chat</button>
      </Link>
    </div>
  );
};

export default Join;
export { user };
