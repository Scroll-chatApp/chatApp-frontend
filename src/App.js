import Chat from "./Components/Chat";
import Messenger from "./Components/Messenger";
import Signin from "./Components/Account/Signin";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Signin/>} />
          <Route path="/messenger" element={<Messenger/>}/>
          <Route path="/chat" element={<Chat/>}/>
        </Routes>
    </div>
  );
}

export default App;
