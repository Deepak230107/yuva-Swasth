import { useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"

function OTP() {
  const navigate = useNavigate()
  const location = useLocation()

  const [otp, setOtp] = useState("")

  const mode = location.state?.mode || "login"
  const registrationData = location.state?.registrationData

  const handleVerify = () => {
    // Demo OTP
    if (otp !== "3074") {
      alert("Invalid OTP. Please try again.")
      return
    }

    // New patient registration
    if (mode === "register") {
      navigate("/health-id", {
        state: {
          registrationData
        }
      })

      return
    }

    // Existing patient login
    navigate("/home")
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="brand">
          <div className="brand-mark">S</div>
          <span>SWASTH</span>
        </div>

        <div className="login-header">
          <p className="eyebrow">SECURE VERIFICATION</p>

          <h1>Verify your number</h1>

          <p className="subtitle">
            Enter the 4-digit OTP sent to your mobile number.
          </p>
        </div>

        <div className="form-group">

          <label>
            One-Time Password
          </label>

          <input
            type="text"
            value={otp}
            onChange={(e) => {
              const value = e.target.value
                .replace(/\D/g, "")
                .slice(0, 4)

              setOtp(value)
            }}
            maxLength="4"
            inputMode="numeric"
            placeholder="Enter 4-digit OTP"
            className="otp-input"
          />

        </div>

        <button
          onClick={handleVerify}
          className="primary-button"
        >
          Verify & Continue
        </button>

        <p className="register-text">
          Didn't receive the OTP?{" "}
          <span>
            Resend OTP
          </span>
        </p>

      </div>
    </div>
  )
}

export default OTP