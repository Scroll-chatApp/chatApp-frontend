import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Data } from "../contextApi/UserData";
import "./Signin.css";

const Signin = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail]=useState("");
  const {account, setAccount}= useContext(Data);
  const navigate=useNavigate();
  const handleSubmit=async (e)=>{
    console.log("login button clicked")
    e.preventDefault();
    try {
        let response = await axios.post("http://localhost:4000/auth/signin", {userName, email});
        setAccount(response.data);
        navigate("/chat")
    } catch (error) {
        console.error(error);
    }
  }
  return (
    <div className="signin">
      <h2>Login Here</h2>
      <input type="text" placeholder="Enter your username" onChange={(e)=>setUserName(e.target.value)} required={true}/>
      <input type="email" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)} required={true}/>
      <button className="siginButton" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Signin;
