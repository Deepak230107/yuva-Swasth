import { useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="brand">
          <div className="brand-mark">S</div>
          <span>SWASTH</span>
        </div>

        <div className="login-header">
          <p className="eyebrow">YOUR HEALTH, CONNECTED</p>

          <h1>Welcome back</h1>

          <p className="subtitle">
            Access your health records and care journey securely.
          </p>
        </div>

        <div className="form-group">
          <label>Mobile Number</label>

          <div className="phone-input">
            <span>+91</span>

            <input
              type="tel"
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        <button
          onClick={() => navigate("/otp")}
          className="primary-button"
        >
          Continue
        </button>

        <p className="register-text">
          New to SWASTH?{" "}
          <span onClick={() => navigate("/register")}>
            Create an account
          </span>
        </p>

        <p className="security-text">
          Your health information is securely protected.
        </p>

      </div>
    </div>
  )
}

export default Login