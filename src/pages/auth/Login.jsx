import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  const [loginType, setLoginType] = useState("mobile")
  const [identifier, setIdentifier] = useState("")

  const handleContinue = () => {
    if (!identifier.trim()) {
      alert(
        loginType === "mobile"
          ? "Please enter your mobile number."
          : "Please enter your SWASTH Health ID."
      )
      return
    }

    // Demo mobile OTP
    if (loginType === "mobile") {
      if (identifier !== "8610053326") {
        alert("Please enter the registered mobile number.")
        return
      }

      alert("OTP sent successfully!")

      navigate("/otp", {
        state: {
          mode: "login",
          phone: identifier
        }
      })

      return
    }

    // Health ID login
    navigate("/otp", {
      state: {
        mode: "login",
        healthId: identifier
      }
    })
  }

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

        {/* Login type */}

        <div className="login-toggle">

          <button
            type="button"
            onClick={() => {
              setLoginType("mobile")
              setIdentifier("")
            }}
            className={
              loginType === "mobile"
                ? "login-toggle-active"
                : "login-toggle-button"
            }
          >
            Mobile Number
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginType("healthId")
              setIdentifier("")
            }}
            className={
              loginType === "healthId"
                ? "login-toggle-active"
                : "login-toggle-button"
            }
          >
            Health ID
          </button>

        </div>

        {/* Identifier */}

        <div className="form-group">

          <label>
            {loginType === "mobile"
              ? "Mobile Number"
              : "SWASTH Health ID"}
          </label>

          {loginType === "mobile" ? (

            <div className="phone-input">

              <span>+91</span>

              <input
                type="tel"
                value={identifier}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)

                  setIdentifier(value)
                }}
                placeholder="Enter mobile number"
                maxLength="10"
                inputMode="numeric"
              />

            </div>

          ) : (

            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your SWASTH Health ID"
            />

          )}

        </div>

        <button
          onClick={handleContinue}
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