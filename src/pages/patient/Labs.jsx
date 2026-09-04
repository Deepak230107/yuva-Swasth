import { useNavigate } from "react-router-dom"
import { ArrowLeft, FlaskConical } from "lucide-react"
import { patient, labReports } from "../../data/mockData"

function Labs() {
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
          <h1>Lab Reports</h1>
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
            <p className="eyebrow">DIAGNOSTIC RESULTS</p>
            <h2>Your lab reports</h2>
          </div>

          <span>{labReports.length} reports</span>
        </div>

        <div className="record-list">

          {labReports.map((report) => (
            <div
              key={report.reportId}
              className="record-card"
            >

              <div className="record-icon">
                <FlaskConical size={22} />
              </div>

              <div className="record-content">
                <strong>{report.testName}</strong>

                <span>
                  {report.date} · {report.facility}
                </span>

                <small>
                  Result: {report.result}
                </small>
              </div>

              <span className="status-badge">
                {report.status}
              </span>

            </div>
          ))}

        </div>

      </main>
    </div>
  )
}

export default Labs