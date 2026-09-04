import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Save } from "lucide-react"
import { patient, labReports } from "../../data/mockData"

function AddLabResult() {
  const navigate = useNavigate()

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
          <p className="module-label">SWASTH</p>
          <h1>Add Lab Result</h1>
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
            <p className="eyebrow">DIAGNOSTIC RECORD</p>
            <h2>Lab result</h2>
            <p>
              Record the result of a diagnostic test.
            </p>
          </div>

          <div className="form-field">
            <label htmlFor="testName">
              Test name
            </label>

            <input
              id="testName"
              name="testName"
              value={form.testName}
              onChange={handleChange}
              placeholder="Example: Complete Blood Count"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="result">
              Result
            </label>

            <input
              id="result"
              name="result"
              value={form.result}
              onChange={handleChange}
              placeholder="Example: Within normal range"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Normal">Normal</option>
              <option value="Attention">Needs attention</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <button
            type="submit"
            className="primary-button save-record-button"
          >
            <Save size={18} />
            Save Lab Result
          </button>

        </form>

      </main>

    </div>
  )
}

export default AddLabResult