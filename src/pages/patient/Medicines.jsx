import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Pill, Clock } from "lucide-react"
import { patient, medicines } from "../../data/mockData"
import LanguageSelector from "../../components/LanguageSelector"
function Medicines() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="module-page">

      <header className="module-header">

        <button
          onClick={() => navigate("/home")}
          className="back-button"
          title={t("back")}
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <p className="module-label">SWASTH</p>
          <h1>{t("medicines")}</h1>
        </div>

        <div className="module-header-actions">
          <LanguageSelector />
        </div>

      </header>

      <main className="module-main">

        <section className="patient-summary">
          <span>{t("patient")}</span>
          <strong>{patient.name}</strong>
          <small>
            {t("healthId")}: {patient.healthId}
          </small>
        </section>

        <div className="module-section-heading">

          <div>
            <p className="eyebrow">
              {t("currentMedication")}
            </p>

            <h2>
              {t("yourMedicines")}
            </h2>
          </div>

          <span>
            {medicines.length} {t("medicinesCount")}
          </span>

        </div>

        <div className="record-list">

          {medicines.map((medicine) => (

            <div
              key={medicine.medicineId}
              className="record-card"
            >

              <div className="record-icon">
                <Pill size={22} />
              </div>

              <div className="record-content">

                <strong>
                  {medicine.name}
                </strong>

                <span>
                  {medicine.dosage} · {medicine.frequency}
                </span>

                <small>
                  {medicine.purpose}
                </small>

                <small>
                  {t("duration")}: {medicine.duration} ·{" "}
                  {t("prescribedBy")} {medicine.prescribedBy}
                </small>

                <small>
                  <Clock
                    size={12}
                    style={{
                      display: "inline",
                      marginRight: "4px"
                    }}
                  />

                  {t("started")} {medicine.prescribedDate}
                </small>

              </div>

              <span className="status-badge">
                {medicine.status}
              </span>

            </div>

          ))}

        </div>

      </main>

    </div>
  )
}

export default Medicines