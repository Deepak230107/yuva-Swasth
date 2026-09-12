import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { UserRound, Stethoscope } from "lucide-react"
import LanguageSelector from "../components/LanguageSelector"

function RoleSelection() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="role-page">

      <div className="role-container">

        <div className="role-header">
          <div className="role-header-top">
            <p className="module-label">{t("common.brand")}</p>
            <LanguageSelector />
          </div>

          <h1>{t("role.howAccess")}</h1>

          <p>
            {t("role.selectRolePrompt")}
          </p>
        </div>

        <div className="role-grid">

          <button
            onClick={() => navigate("/login")}
            className="role-card"
          >
            <div className="role-icon">
              <UserRound size={25} />
            </div>

            <div>
              <strong>{t("role.patient")}</strong>
              <span>
                {t("role.patientDesc")}
              </span>
            </div>
          </button>


          <button
            onClick={() => navigate("/worker-login")}
            className="role-card"
          >
            <div className="role-icon">
              <Stethoscope size={25} />
            </div>

            <div>
              <strong>{t("role.healthcareWorker")}</strong>
              <span>
                {t("role.workerDesc")}
              </span>
            </div>
          </button>

        </div>

      </div>

    </div>
  )
}

export default RoleSelection