import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Copy, Check, Link as LinkIcon } from "lucide-react"
import { HEALTH_ID } from "../../data/mockData"
import LanguageSelector from "../../components/LanguageSelector"

function HealthID() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()

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
      alert(t("healthId.unableToCopy"))
    }
  }

  const handleLinkAbha = () => {
    if (abha.length !== 14) {
      alert(t("healthId.invalidAbha"))
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
          <span>{t("common.brand")}</span>
        </div>

        <div className="health-id-language">
          <LanguageSelector />
        </div>


        {/* Success */}

        <div className="success-mark">
          <Check size={30} />
        </div>

        <p className="eyebrow">
          {t("healthId.registrationComplete")}
        </p>

        <h1>
          {t("healthId.healthProfileReady")}
        </h1>

        <p className="health-id-subtitle">
          {t("healthId.healthProfileDescription")}
        </p>


        {/* Health ID */}

        <div className="health-id-box">

          <p>
            {t("healthId.yourHealthId")}
          </p>

          <div className="health-id-value">

            <span>
              {HEALTH_ID}
            </span>

            <button
              onClick={copyHealthID}
              title={t("healthId.copyTitle")}
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
              {t("healthId.copiedToClipboard")}
            </span>
          )}

        </div>


        {/* Registered patient details */}

        {registrationData && (
          <div className="profile-summary">

            <p className="eyebrow">
              {t("healthId.profile")}
            </p>

            <div className="profile-summary-row">
              <span>{t("healthId.name")}</span>
              <strong>{registrationData.name}</strong>
            </div>

            <div className="profile-summary-row">
              <span>{t("healthId.mobile")}</span>
              <strong>+91 {registrationData.mobile}</strong>
            </div>

            <div className="profile-summary-row">
              <span>{t("healthId.district")}</span>
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
                {t("healthId.abhaNumber")}
              </h3>

              <p>
                {t("healthId.optional")}
              </p>
            </div>

          </div>


          {!abhaLinked ? (

            <>
              <p className="abha-description">
                {t("healthId.abhaDescription")}
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
                placeholder={t("healthId.abhaPlaceholder")}
                maxLength="14"
                inputMode="numeric"
              />

              <button
                onClick={handleLinkAbha}
                className="secondary-button"
              >
                {t("healthId.linkAbha")}
              </button>

              <p className="abha-note">
                {t("healthId.abhaSkipLater")}
              </p>
            </>

          ) : (

            <div className="abha-linked">

              <Check size={18} />

              <div>
                <strong>
                  {t("healthId.abhaLinked")}
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
          {t("healthId.continueToSwast")}
        </button>

        <p className="security-text">
          {t("healthId.securityText")}
        </p>

      </div>
    </div>
  )
}

export default HealthID