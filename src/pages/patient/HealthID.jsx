import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Copy, Check, Link as LinkIcon } from "lucide-react"
import { HEALTH_ID } from "../../data/mockData"

function HealthID() {
  const navigate = useNavigate()
  const location = useLocation()

  const [copied, setCopied] = useState(false)
  const [abha, setAbha] = useState("")
  const [abhaLinked, setAbhaLinked] = useState(false)

  const registrationData = location.state?.registrationData

  const copyHealthID = async () => {
    try {
      await navigator.clipboard.writeText(HEALTH_ID)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      alert("Unable to copy Health ID.")
    }
  }

  const handleLinkAbha = () => {
    if (abha.length !== 14) {
      alert("Please enter a valid 14-digit ABHA number.")
      return
    }

    // Mock linking for now.
    // Actual ABDM verification will be implemented later.
    setAbhaLinked(true)
  }

  return (
    <div className="health-id-page">
      <div className="health-id-card">

        {/* Brand */}

        <div className="brand">
          <div className="brand-mark">S</div>
          <span>SWASTH</span>
        </div>


        {/* Success */}

        <div className="success-mark">
          <Check size={30} />
        </div>

        <p className="eyebrow">
          REGISTRATION COMPLETE
        </p>

        <h1>
          Your health profile is ready
        </h1>

        <p className="health-id-subtitle">
          Your unique SWASTH Health ID can be used to access
          your health records across participating healthcare services.
        </p>


        {/* Health ID */}

        <div className="health-id-box">

          <p>
            Your SWASTH Health ID
          </p>

          <div className="health-id-value">

            <span>
              {HEALTH_ID}
            </span>

            <button
              onClick={copyHealthID}
              title="Copy Health ID"
              className="copy-button"
            >
              {copied ? (
                <Check size={19} />
              ) : (
                <Copy size={19} />
              )}
            </button>

          </div>

          {copied && (
            <span className="copied-text">
              Copied to clipboard
            </span>
          )}

        </div>


        {/* Registered patient details */}

        {registrationData && (
          <div className="profile-summary">

            <p className="eyebrow">
              PROFILE
            </p>

            <div className="profile-summary-row">
              <span>Name</span>
              <strong>{registrationData.name}</strong>
            </div>

            <div className="profile-summary-row">
              <span>Mobile</span>
              <strong>+91 {registrationData.mobile}</strong>
            </div>

            <div className="profile-summary-row">
              <span>District</span>
              <strong>{registrationData.district || "—"}</strong>
            </div>

          </div>
        )}


        {/* ABHA */}

        <div className="abha-box">

          <div className="abha-heading">

            <div className="abha-icon">
              <LinkIcon size={18} />
            </div>

            <div>
              <h3>
                ABHA Number
              </h3>

              <p>
                Optional
              </p>
            </div>

          </div>


          {!abhaLinked ? (

            <>
              <p className="abha-description">
                Already have an ABHA Number? You can link it
                to your SWASTH profile.
              </p>

              <input
                type="text"
                value={abha}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 14)

                  setAbha(value)
                }}
                placeholder="Enter 14-digit ABHA number"
                maxLength="14"
                inputMode="numeric"
              />

              <button
                onClick={handleLinkAbha}
                className="secondary-button"
              >
                Link ABHA
              </button>

              <p className="abha-note">
                You can also skip this and link ABHA later.
              </p>
            </>

          ) : (

            <div className="abha-linked">

              <Check size={18} />

              <div>
                <strong>
                  ABHA linked
                </strong>

                <span>
                  ABHA •••• •••• {abha.slice(-4)}
                </span>
              </div>

            </div>

          )}

        </div>


        {/* Continue */}

        <button
          onClick={() => navigate("/home")}
          className="primary-button"
        >
          Continue to SWASTH
        </button>

        <p className="security-text">
          Keep your Health ID safe. You may need it when
          visiting a healthcare worker.
        </p>

      </div>
    </div>
  )
}

export default HealthID