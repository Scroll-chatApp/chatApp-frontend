import React, { createContext, useState } from "react";
export const Data = createContext(null);
export const UserData = ({ children }) => {
  const [account, setAccount] = useState({ _id: "", username: "", email: "" });
  return (
    <Data.Provider value={{ account, setAccount }}>{children}</Data.Provider>
  );
};

export default UserData;
