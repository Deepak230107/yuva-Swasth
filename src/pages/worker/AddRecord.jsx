import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Save } from "lucide-react"
import { patient, medicalRecords } from "../../data/mockData"
import LanguageSelector from "../../components/LanguageSelector"

function AddRecord() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [form, setForm] = useState({
    diagnosis: "",
    notes: "",
    treatment: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.diagnosis.trim()) {
      return
    }

    medicalRecords.push({
      recordId: `REC${medicalRecords.length + 1}`,
      patientId: patient.patientId,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }),
      facility: "Madurai District Hospital",
      healthWorker: "Dr. Ravi Kumar",
      diagnosis: form.diagnosis,
      notes: form.notes,
      treatment: form.treatment,
      status: "Completed"
    })

    navigate("/worker/patient")
  }

  return (
    <div className="module-page">

      <header className="module-header">

        <button
          onClick={() => navigate("/worker/patient")}
          className="back-button"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <p className="module-label">{t("common.brand")}</p>
          <h1>{t("worker.addConsultation")}</h1>
        </div>

        <div className="module-header-actions">
          <LanguageSelector />
        </div>

      </header>


      <main className="module-main">

        <section className="patient-summary">
          <span>{t("worker.patient")}</span>
          <strong>{patient.name}</strong>
          <small>{t("healthId.myHealthId")}: {patient.healthId}</small>
        </section>


        <form
          onSubmit={handleSubmit}
          className="consultation-form"
        >

          <div className="form-heading">
            <p className="eyebrow">{t("worker.newMedicalRecord")}</p>
            <h2>{t("worker.consultationDetails")}</h2>
            <p>
              {t("worker.consultationInfo")}
            </p>
          </div>


          <div className="form-field">

            <label htmlFor="diagnosis">
              {t("worker.diagnosis")}
            </label>

            <input
              id="diagnosis"
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              placeholder={t("worker.diagnosisPlaceholder")}
              required
            />

          </div>


          <div className="form-field">

            <label htmlFor="notes">
              {t("worker.clinicalNotes")}
            </label>

            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder={t("worker.notesPlaceholder")}
              rows="5"
            />

          </div>


          <div className="form-field">

            <label htmlFor="treatment">
              {t("worker.treatmentAdvice")}
            </label>

            <textarea
              id="treatment"
              name="treatment"
              value={form.treatment}
              onChange={handleChange}
              placeholder={t("worker.treatmentPlaceholder")}
              rows="4"
            />

          </div>


          <button
            type="submit"
            className="primary-button save-record-button"
          >
            <Save size={18} />
            {t("worker.saveConsultation")}
          </button>

        </form>

      </main>

    </div>
  )
}

export default AddRecord