import { useNavigate } from "react-router-dom"
import { ArrowLeft, FileText, ChevronRight } from "lucide-react"
import { patient, medicalRecords } from "../../data/mockData"

function Records() {
  const navigate = useNavigate()

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
          <p className="module-label">SWASTH</p>
          <h1>Health Records</h1>
        </div>
      </header>

      <main className="module-main">

        <section className="patient-summary">
          <span>Patient</span>
          <strong>{patient.name}</strong>
          <small>Health ID: {patient.healthId}</small>
        </section>

        <div className="module-section-heading">
          <div>
            <p className="eyebrow">MEDICAL HISTORY</p>
            <h2>Your records</h2>
          </div>

          <span>{medicalRecords.length} records</span>
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