import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home"
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home/>}></Route>
              <Route path="/login" element={<Login/>}></Route>
              <Route path="/signup" element={<Signup/>}></Route>
          </Routes>
      </BrowserRouter>
  )
}

export default App
