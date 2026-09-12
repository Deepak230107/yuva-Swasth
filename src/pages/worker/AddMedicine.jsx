import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Save } from "lucide-react"
import { patient, medicines } from "../../data/mockData"
import LanguageSelector from "../../components/LanguageSelector"

function AddMedicine() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.name.trim()) {
      return
    }

    medicines.push({
      medicineId: `MED${medicines.length + 1}`,
      patientId: patient.patientId,
      name: form.name,
      dosage: form.dosage,
      frequency: form.frequency,
      duration: form.duration,
      prescribedBy: "Dr. Ravi Kumar",
      prescribedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }),
      status: "Active"
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
          <h1>{t("worker.prescribeMedicine")}</h1>
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
            <p className="eyebrow">{t("worker.newPrescription")}</p>
            <h2>{t("worker.medicineDetails")}</h2>
            <p>
              {t("worker.medicineInstruction")}
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="name">
              {t("worker.medicineName")}
            </label>

            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("worker.medicineNamePlaceholder")}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="dosage">
              {t("worker.dosage")}
            </label>

            <input
              id="dosage"
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              placeholder={t("worker.dosagePlaceholder")}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="frequency">
              {t("worker.frequency")}
            </label>

            <input
              id="frequency"
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              placeholder={t("worker.frequencyPlaceholder")}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="duration">
              {t("worker.duration")}
            </label>

            <input
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder={t("worker.durationPlaceholder")}
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button save-record-button"
          >
            <Save size={18} />
            {t("worker.savePrescription")}
          </button>

        </form>

      </main>

    </div>
  )
}

export default AddMedicine