import { useNavigate } from "react-router-dom"

function OTP() {
  const navigate = useNavigate()

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
            Enter the 6-digit OTP sent to your mobile number.
          </p>
        </div>

        <div className="form-group">
          <label>One-Time Password</label>

          <input
            type="text"
            maxLength="6"
            inputMode="numeric"
            placeholder="Enter 6-digit OTP"
            className="otp-input"
          />
        </div>

        <button
          onClick={() => navigate("/register")}
          className="primary-button"
        >
          Verify & Continue
        </button>

        <p className="register-text">
          Didn't receive the OTP?{" "}
          <span>Resend OTP</span>
        </p>

      </div>
    </div>
  )
}

export default OTP