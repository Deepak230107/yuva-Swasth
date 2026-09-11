import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"

function WorkerLogin() {
  const navigate = useNavigate()

  const [workerId, setWorkerId] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = () => {
    setError("")

    if (!workerId.trim() || !password.trim()) {
      setError("Please enter your Worker ID and password.")
      return
    }

    // Demo healthcare worker credentials
    if (workerId === "HW1001" && password === "Swasth@123") {
      navigate("/worker")
      return
    }

    setError("Invalid Worker ID or password.")
  }

  return (
    <div className="login-page">

      <div className="login-card">

        {/* Brand */}

        <div className="brand">
          <div className="brand-mark">
            S
          </div>

          <span>
            SWASTH
          </span>
        </div>


        {/* Header */}

        <div className="login-header">

          <p className="eyebrow">
            SECURE STAFF ACCESS
          </p>

          <h1>
            Healthcare Worker
          </h1>

          <p className="subtitle">
            Access patient records, manage care and coordinate referrals securely.
          </p>

        </div>


        {/* Worker ID */}

        <div className="form-group">

          <label>
            Healthcare Worker ID
          </label>

          <input
            type="text"
            value={workerId}
            onChange={(e) => {
              setWorkerId(e.target.value)
              setError("")
            }}
            placeholder="Enter your Worker ID"
            className="worker-login-input"
          />

        </div>


        {/* Password */}

        <div className="form-group">

          <label>
            Password
          </label>

          <div className="password-wrapper">

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="Enter your password"
              className="worker-login-input"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>

          </div>

        </div>


        {/* Error */}

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}


        {/* Sign In */}

        <button
          onClick={handleLogin}
          className="primary-button"
        >
          Sign In
        </button>




        {/* Back */}

        <p className="register-text">

          <span onClick={() => navigate("/")}>
            ← Back to patient login
          </span>

        </p>


        {/* Security */}

        <p className="security-text">
          Your access is restricted to authorized healthcare personnel.
        </p>

      </div>

    </div>
  )
}

export default WorkerLogin