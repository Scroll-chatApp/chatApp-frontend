import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import scrollLogo from "../../image/scrollLogo.png";
import "./join.css";

const Join = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  function handleChange(event) {
    setUserName(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem("user", userName);
    navigate("/chat");
  };

  return (
    <div className="joinPage">
      <form className="joinContainer" onSubmit={handleSubmit}>
        <img className="logoScroll" src={scrollLogo} alt="logo" />
        <h1>Time to Scroll</h1>
        <input
          className="inputScroll"
          placeholder="Identify yourself"
          id="username"
          value={userName}
          required
          onChange={handleChange}
        />
        <div className="linkButton">
          <button className="joinButton">Let's chat</button>
        </div>
      </form>
    </div>
  );
};

export default Join;
