import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import { patient, medicalRecords } from "../../data/mockData"

function AddRecord() {
  const navigate = useNavigate()

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
          <p className="module-label">SWASTH</p>
          <h1>Add Consultation</h1>
        </div>

      </header>


      <main className="module-main">

        <section className="patient-summary">
          <span>Patient</span>
          <strong>{patient.name}</strong>
          <small>Health ID: {patient.healthId}</small>
        </section>


        <form
          onSubmit={handleSubmit}
          className="consultation-form"
        >

          <div className="form-heading">
            <p className="eyebrow">NEW MEDICAL RECORD</p>
            <h2>Consultation details</h2>
            <p>
              Record the information from today's consultation.
            </p>
          </div>


          <div className="form-field">

            <label htmlFor="diagnosis">
              Diagnosis
            </label>

            <input
              id="diagnosis"
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              placeholder="Enter diagnosis"
              required
            />

          </div>


          <div className="form-field">

            <label htmlFor="notes">
              Clinical Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Enter relevant observations and notes"
              rows="5"
            />

          </div>


          <div className="form-field">

            <label htmlFor="treatment">
              Treatment / Advice
            </label>

            <textarea
              id="treatment"
              name="treatment"
              value={form.treatment}
              onChange={handleChange}
              placeholder="Enter treatment or advice given"
              rows="4"
            />

          </div>


          <button
            type="submit"
            className="primary-button save-record-button"
          >
            <Save size={18} />
            Save Consultation
          </button>

        </form>

      </main>

    </div>
  )
}

export default AddRecord