import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, FlaskConical } from "lucide-react"
import { patient, labReports } from "../../data/mockData"
import LanguageSelector from "../../components/LanguageSelector"

function Labs() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="module-page">

      <header className="module-header">
        <button
          onClick={() => navigate("/home")}
          className="back-button"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <p className="module-label">{t("common.brand")}</p>
          <h1>{t("nav.labs")}</h1>
        </div>
        <div className="module-header-actions">
          <LanguageSelector />
        </div>      </header>

      <main className="module-main">

        <section className="patient-summary">
          <span>{t("common.patient")}</span>
          <strong>{patient.name}</strong>
          <small>{t("healthId.myHealthId")}: {patient.healthId}</small>
        </section>

        <div className="module-section-heading">
          <div>
            <p className="eyebrow">{t("labs.diagnosticResults")}</p>
            <h2>{t("labs.yourLabReports")}</h2>
          </div>

          <span>{labReports.length} {t("labs.reportsCount")}</span>
        </div>

        <div className="record-list">

          {labReports.map((report) => (
            <div
              key={report.reportId}
              className="record-card"
            >

              <div className="record-icon">
                <FlaskConical size={22} />
              </div>

              <div className="record-content">
                <strong>{report.testName}</strong>

                <span>
                  {report.date} · {report.facility}
                </span>

                <small>
                  Result: {report.result}
                </small>
              </div>

              <span className="status-badge">
                {report.status}
              </span>

            </div>
          ))}

        </div>

      </main>
    </div>
  )
}

export default Labs