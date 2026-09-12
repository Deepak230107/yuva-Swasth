import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import LanguageSelector from "../../components/LanguageSelector"

function Register() {
  const navigate = useNavigate()
  const { t } = useTranslation()

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
      alert(t("auth.requiredDetails"))
      return
    }

    if (form.mobile.length !== 10) {
      alert(t("auth.validMobile"))
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

        <div className="brand-row">
          <div className="brand">
            <div className="brand-mark">S</div>
            <span>{t("common.brand")}</span>
          </div>
          <LanguageSelector />
        </div>

        <div className="register-header">
          <p className="eyebrow">{t("auth.createProfile")}</p>

          <h1>{t("auth.tellUsAboutYou")}</h1>

          <p className="subtitle">
            {t("auth.registrationSubtitle")}
          </p>
        </div>

        <div className="registration-form">

          <div className="form-group">
            <label>{t("auth.fullNameLabel")}</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("auth.fullNamePlaceholder")}
            />
          </div>


          <div className="form-row">

            <div className="form-group">
              <label>{t("auth.dateOfBirth")}</label>

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </div>


            <div className="form-group">
              <label>{t("auth.gender")}</label>

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="" disabled>
                  {t("auth.select")}
                </option>

                <option value="Female">
                  {t("auth.female")}
                </option>

                <option value="Male">
                  {t("auth.male")}
                </option>

                <option value="Other">
                  {t("auth.other")}
                </option>
              </select>
            </div>

          </div>


          <div className="form-group">
            <label>{t("auth.mobileNumber")}</label>

            <div className="phone-input">

              <span>+91</span>

              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder={t("auth.enterMobile")}
                maxLength="10"
              />

            </div>
          </div>


          <div className="form-group">
            <label>{t("auth.address")}</label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder={t("auth.addressPlaceholder")}
            />
          </div>


          <div className="form-row">

            <div className="form-group">
              <label>{t("auth.village")}</label>

              <input
                type="text"
                name="village"
                value={form.village}
                onChange={handleChange}
                placeholder={t("auth.village")}
              />
            </div>


            <div className="form-group">
              <label>{t("auth.district")}</label>

              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder={t("auth.district")}
              />
            </div>

          </div>


          <div className="form-row">

            <div className="form-group">
              <label>{t("auth.state")}</label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder={t("auth.state")}
              />
            </div>


            <div className="form-group">
              <label>{t("auth.pinCode")}</label>

              <input
                type="text"
                name="pin"
                value={form.pin}
                onChange={handleChange}
                maxLength="6"
                placeholder={t("auth.pinCodePlaceholder")}
              />
            </div>

          </div>


          <div className="form-group">
            <label>{t("auth.emergencyContact")}</label>

            <input
              type="tel"
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
              placeholder={t("auth.emergencyContactPlaceholder")}
            />
          </div>

        </div>


        <button
          onClick={handleContinue}
          className="primary-button"
        >
          {t("auth.continueOtp")}
        </button>


        <p className="security-text">
          {t("auth.privateInfo")}
        </p>

      </div>
    </div>
  )
}

export default Register