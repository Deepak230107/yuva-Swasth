import { BrowserRouter, Routes, Route } from "react-router-dom"

import RoleSelection from "./pages/RoleSelection"


import Login from "./pages/auth/Login"
import OTP from "./pages/auth/OTP"
import Register from "./pages/auth/Register"
import WorkerLogin from "./pages/auth/WorkerLogin"

import Home from "./pages/patient/Home"
import HealthID from "./pages/patient/HealthID"
import Records from "./pages/patient/Records"
import Medicines from "./pages/patient/Medicines"
import Labs from "./pages/patient/Labs"
import Appointments from "./pages/patient/Appointments"
import CareJourney from "./pages/patient/CareJourney"
import Teleconsultation from "./pages/patient/Teleconsultation"

import WorkerHome from "./pages/worker/WorkerHome"
import PatientSearch from "./pages/worker/PatientSearch"
import PatientOverview from "./pages/worker/PatientOverview"
import AddRecord from "./pages/worker/AddRecord"
import AddMedicine from "./pages/worker/AddMedicine"
import AddLabResult from "./pages/worker/AddLabResult"


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Role selection */}
        <Route path="/" element={<RoleSelection />} />


        {/* Patient authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/register" element={<Register />} />

        {/* Patient pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/health-id" element={<HealthID />} />
        <Route path="/records" element={<Records />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/care-journey" element={<CareJourney />} />
        <Route
  path="/teleconsultation"
  element={<Teleconsultation />}
/>

        {/* Healthcare worker authentication */}
        <Route path="/worker-login" element={<WorkerLogin />} />

        {/* Healthcare worker pages */}
        <Route path="/worker" element={<WorkerHome />} />
        <Route path="/worker/search" element={<PatientSearch />} />
        <Route
          path="/worker/patient"
          element={<PatientOverview />}
        />
        <Route
          path="/worker/add-record"
          element={<AddRecord />}
        /><Route
  path="/worker/add-medicine"
  element={<AddMedicine />}
/>
<Route
  path="/worker/add-lab"
  element={<AddLabResult />}
/>


      </Routes>

    </BrowserRouter>
  )
}

export default App