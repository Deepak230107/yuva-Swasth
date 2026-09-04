import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import { patient, medicines } from "../../data/mockData"

function AddMedicine() {
  const navigate = useNavigate()

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
          <p className="module-label">SWASTH</p>
          <h1>Prescribe Medicine</h1>
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
            <p className="eyebrow">NEW PRESCRIPTION</p>
            <h2>Medicine details</h2>
            <p>
              Add the medication prescribed during this consultation.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="name">
              Medicine name
            </label>

            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Example: Paracetamol 500 mg"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="dosage">
              Dosage
            </label>

            <input
              id="dosage"
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              placeholder="Example: 1 tablet"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="frequency">
              Frequency
            </label>

            <input
              id="frequency"
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              placeholder="Example: Twice a day"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="duration">
              Duration
            </label>

            <input
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="Example: 5 days"
              required
            />
          </div>

          <button
            type="submit"
            className="primary-button save-record-button"
          >
            <Save size={18} />
            Save Prescription
          </button>

        </form>

      </main>

    </div>
  )
}

export default AddMedicine