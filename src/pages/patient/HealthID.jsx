import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Copy, Check } from "lucide-react"
import { HEALTH_ID } from "../../data/mockData"

function HealthID() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const copyHealthID = async () => {
    await navigator.clipboard.writeText(HEALTH_ID)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="health-id-page">
      <div className="health-id-card">

        <div className="brand">
          <div className="brand-mark">S</div>
          <span>SWASTH</span>
        </div>

        <div className="success-mark">
          <Check size={30} />
        </div>

        <p className="eyebrow">REGISTRATION COMPLETE</p>

        <h1>Your health profile is ready</h1>

        <p className="health-id-subtitle">
          Your unique SWASTH Health ID can be used to access
          your health records across participating healthcare services.
        </p>

        <div className="health-id-box">
          <p>Your SWASTH Health ID</p>

          <div className="health-id-value">
            <span>{HEALTH_ID}</span>

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

        <button
          onClick={() => navigate("/home")}
          className="primary-button"
        >
          Continue to SWASTH
        </button>

        <p className="security-text">
          Keep your Health ID safe. You may need it when visiting a healthcare worker.
        </p>

      </div>
    </div>
  )
}

export default HealthID