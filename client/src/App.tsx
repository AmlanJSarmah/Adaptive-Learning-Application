import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login";
import Math from "./pages/Math";
import English from "./pages/English";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/math" element={<Math />} />
        <Route path="/english" element={<English />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
