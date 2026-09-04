import Home from "./pages/patient/Home"
import Register from "./pages/auth/Register"
import HealthID from "./pages/patient/HealthID"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/auth/Login"
import OTP from "./pages/auth/OTP"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/health-id" element={<HealthID />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App