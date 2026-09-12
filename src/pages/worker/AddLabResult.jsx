import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Save } from "lucide-react"
import { patient, labReports } from "../../data/mockData"
import LanguageSelector from "../../components/LanguageSelector"

function AddLabResult() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [form, setForm] = useState({
    testName: "",
    result: "",
    status: "Normal"
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.testName.trim() || !form.result.trim()) {
      return
    }

    labReports.push({
      reportId: `LAB${labReports.length + 1}`,
      patientId: patient.patientId,
      testName: form.testName,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      }),
      facility: "Madurai District Hospital",
      result: form.result,
      status: form.status
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
          <h1>{t("worker.addLabResult")}</h1>
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
            <p className="eyebrow">{t("worker.diagnosticRecord")}</p>
            <h2>{t("worker.labResult")}</h2>
            <p>
              {t("worker.labResultInstruction")}
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="testName">
              {t("worker.testName")}
            </label>

            <input
              id="testName"
              name="testName"
              value={form.testName}
              onChange={handleChange}
              placeholder={t("worker.testNamePlaceholder")}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="result">
              {t("worker.result")}
            </label>

            <input
              id="result"
              name="result"
              value={form.result}
              onChange={handleChange}
              placeholder={t("worker.resultPlaceholder")}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="status">
              {t("worker.status")}
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Normal">{t("worker.normal")}</option>
              <option value="Attention">{t("worker.needsAttention")}</option>
              <option value="Critical">{t("worker.critical")}</option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-button save-record-button"
          >
            <Save size={18} />
            {t("worker.saveLabResult")}
          </button>

        </form>

      </main>

    </div>
  )
}

export default AddLabResult