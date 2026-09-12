import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, FileText, ChevronRight } from "lucide-react"
import { patient, medicalRecords } from "../../data/mockData"
import LanguageSelector from "../../components/LanguageSelector"

function Records() {
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
          <h1>{t("records.myRecords")}</h1>
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
            <p className="eyebrow">{t("records.medicalHistory")}</p>
            <h2>{t("records.yourRecords")}</h2>
          </div>

          <span>{medicalRecords.length} {t("records.recordsCount")}</span>
        </div>

        <div className="record-list">

          {medicalRecords.map((record) => (
            <button
              key={record.recordId}
              className="record-card"
            >

              <div className="record-icon">
                <FileText size={22} />
              </div>

              <div className="record-content">
                <strong>{record.diagnosis}</strong>

                <span>
                  {record.date} · {record.facility}
                </span>

                <small>
                  {record.healthWorker}
                </small>
              </div>

              <ChevronRight size={19} />

            </button>
          ))}

        </div>

      </main>
    </div>
  )
}

export default Records