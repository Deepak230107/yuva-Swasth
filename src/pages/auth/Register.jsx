import { useNavigate } from "react-router-dom"

function Register() {
  const navigate = useNavigate()

  return (
    <div className="register-page">
      <div className="register-card">

        <div className="brand">
          <div className="brand-mark">S</div>
          <span>SWASTH</span>
        </div>

        <div className="register-header">
          <p className="eyebrow">CREATE YOUR PROFILE</p>

          <h1>Tell us about yourself</h1>

          <p className="subtitle">
            These details help us maintain your health record.
          </p>
        </div>

        <div className="registration-form">

          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Enter your full name" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select defaultValue="">
                <option value="" disabled>Select</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input type="tel" placeholder="Enter mobile number" />
          </div>

          <div className="form-group">
            <label>Address / House No.</label>
            <input
              type="text"
              placeholder="House number, street / locality"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Village</label>
              <input type="text" placeholder="Village" />
            </div>

            <div className="form-group">
              <label>District</label>
              <input type="text" placeholder="District" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>State</label>
              <input type="text" placeholder="State" />
            </div>

            <div className="form-group">
              <label>PIN Code</label>
              <input
                type="text"
                maxLength="6"
                placeholder="PIN code"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Emergency Contact</label>
            <input
              type="tel"
              placeholder="Emergency contact number"
            />
          </div>

        </div>

        <button
          onClick={() => navigate("/health-id")}
          className="primary-button"
        >
          Create Health ID
        </button>

        <p className="security-text">
          Your information is kept secure and private.
        </p>

      </div>
    </div>
  )
}

export default Register