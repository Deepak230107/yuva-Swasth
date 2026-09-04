import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    mobile: "",
    address: "",
    village: "",
    district: "",
    state: "",
    pin: "",
    emergencyContact: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleContinue = () => {
    if (
      !form.name.trim() ||
      !form.dob ||
      !form.gender ||
      !form.mobile.trim()
    ) {
      alert("Please fill in all required details.")
      return
    }

    if (form.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.")
      return
    }

    navigate("/otp", {
      state: {
        mode: "register",
        registrationData: form
      }
    })
  }

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
            <label>Full Name *</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>


          <div className="form-row">

            <div className="form-group">
              <label>Date of Birth *</label>

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label>Gender *</label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

          </div>


          <div className="form-group">
            <label>Mobile Number *</label>

            <div className="phone-input">

              <span>+91</span>

              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                maxLength="10"
              />

            </div>
          </div>


          <div className="form-group">
            <label>Address / House No.</label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House number, street / locality"
            />
          </div>


          <div className="form-row">

            <div className="form-group">
              <label>Village</label>

              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder="Village"
              />
            </div>


            <div className="form-group">
              <label>District</label>

              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="District"
              />
            </div>

          </div>


          <div className="form-row">

            <div className="form-group">
              <label>State</label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>


            <div className="form-group">
              <label>PIN Code</label>

              <input
                type="text"
                name="pin"
                value={form.pin}
                onChange={handleChange}
                maxLength="6"
                placeholder="PIN code"
              />
            </div>

          </div>


          <div className="form-group">
            <label>Emergency Contact</label>

            <input
              type="tel"
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
              placeholder="Emergency contact number"
            />
          </div>

        </div>


        <button
          onClick={handleContinue}
          className="primary-button"
        >
          Continue to OTP
        </button>


        <p className="security-text">
          Your information is kept secure and private.
        </p>

      </div>
    </div>
  )
}

export default Register