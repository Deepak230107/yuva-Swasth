import Home from "./pages/patient/Home"
import Register from "./pages/auth/Register"
import HealthID from "./pages/patient/HealthID"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/auth/Login"
import OTP from "./pages/auth/OTP"
import Records from "./pages/patient/Records"
import Medicines from "./pages/patient/Medicines"
import Labs from "./pages/patient/Labs"
import Appointments from "./pages/patient/Appointments"
import CareJourney from "./pages/patient/CareJourney"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/health-id" element={<HealthID />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/records" element={<Records />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/appointments" element={<Appointments/>}/>
        <Route path="/care-journey"
  element={<CareJourney />}
/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App