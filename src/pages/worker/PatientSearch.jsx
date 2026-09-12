import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  Search,
  UserRound,
  AlertCircle
} from "lucide-react"

import { patient } from "../../data/mockData"
import LanguageSelector from "../../components/LanguageSelector"

function PatientSearch() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [healthId, setHealthId] = useState("")
  const [found, setFound] = useState(false)
  const [searched, setSearched] = useState(false)

  const searchPatient = () => {
    const enteredId = healthId.trim().toLowerCase()
    const actualId = patient.healthId.trim().toLowerCase()

    setSearched(true)

    if (enteredId === actualId) {
      setFound(true)
    } else {
      setFound(false)
    }
  }

  return (
    <div className="module-page">

      {/* Header */}

      <header className="module-header">

        <button
          onClick={() => navigate("/worker")}
          className="back-button"
          title={t("common.back")}
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <p className="module-label">
            {t("common.brand")}
          </p>

          <h1>
            {t("worker.findPatient")}
          </h1>
        </div>

        <div className="module-header-actions">
          <LanguageSelector />
        </div>

      </header>


      {/* Main */}

      <main className="module-main">

        {/* Search Card */}

        <section className="worker-search-card">

          <div className="worker-search-icon">
            <Search size={24} />
          </div>

          <div>
            <h2>
              {t("worker.searchByHealthId")}
            </h2>

            <p>
              {t("worker.searchHealthIdHint")}
            </p>
          </div>


          <div className="health-id-search">

            <input
              type="text"
              value={healthId}
              onChange={(e) => {
                setHealthId(e.target.value)
                setSearched(false)
                setFound(false)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchPatient()
                }
              }}
              placeholder={t("worker.exampleHealthId")}
            />

            <button
              onClick={searchPatient}
              className="primary-button"
            >
              {t("common.search")}
            </button>

          </div>

        </section>


        {/* Patient Found */}

        {found && (
          <section className="patient-result">

            <div className="record-icon">
              <UserRound size={22} />
            </div>

            <div className="record-content">

              <strong>
                {patient.name}
              </strong>

              <span>
                {t("worker.healthIdPrefix")}: {patient.healthId}
              </span>

              <small>
                {patient.gender} · {t("worker.dobLabel")}: {patient.dob}
              </small>

            </div>

            <button
              onClick={() => navigate("/worker/patient")}
              className="primary-button"
            >
              {t("worker.viewPatient")}
            </button>

          </section>
        )}


        {/* Patient Not Found */}

        {searched && !found && (
          <section className="patient-result">

            <div className="record-icon">
              <AlertCircle size={22} />
            </div>

            <div className="record-content">

              <strong>
                {t("worker.patientNotFound")}
              </strong>

              <span>
                {t("worker.noPatientMatches")}
              </span>

              <small>
                {t("worker.checkHealthId")}
              </small>

            </div>

          </section>
        )}

      </main>

    </div>
  )
}

export default PatientSearch