// import Chat from "./Components/Chat";
import Messenger from "./Messenger";
// import Signin from "./Components/Account/Signin";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
        <Routes>
          {/* <Route path="/" element={<Signin/>} /> */}
          <Route path="/messenger" element={<Messenger/>}/>
        </Routes>
      {/* <Messenger/> */}
      {/* <Chat /> */}
    </div>
  );
}

export default App;
