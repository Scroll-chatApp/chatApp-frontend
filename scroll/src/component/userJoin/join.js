import React, { useState } from "react";
import { Link } from "react-router-dom";

let user;
const Join = () => {
  const [userName, setUserName] = useState("");
  function handleChange(event) {
    setUserName(event.target.value);
  }

  const sendUser = () => {
    user = userName;
  };
  return (
    <div>
      <h1>hello from join</h1>
      <input
        placeholder="Enter"
        id="username"
        value={userName}
        onChange={handleChange}
      />
      <Link to="/chat">
        <button onClick={sendUser}>Let's chat</button>
      </Link>
    </div>
  );
};

export default Join;
export { user };
