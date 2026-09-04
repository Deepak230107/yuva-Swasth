import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Search, UserRound } from "lucide-react"
import { patient } from "../../data/mockData"

function PatientSearch() {
  const navigate = useNavigate()
  const [healthId, setHealthId] = useState("")
  const [found, setFound] = useState(false)

  const searchPatient = () => {
    if (healthId.trim() === patient.healthId) {
      setFound(true)
    } else {
      setFound(false)
    }
  }

  return (
    <div className="module-page">

      <header className="module-header">
        <button
          onClick={() => navigate("/worker")}
          className="back-button"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <p className="module-label">SWASTH</p>
          <h1>Find Patient</h1>
        </div>
      </header>

      <main className="module-main">

        <section className="worker-search-card">

          <div className="worker-search-icon">
            <Search size={24} />
          </div>

          <div>
            <h2>Search by Health ID</h2>
            <p>
              Enter the patient's unique SWASTH Health ID.
            </p>
          </div>

          <div className="health-id-search">
            <input
              type="text"
              value={healthId}
              onChange={(e) => setHealthId(e.target.value)}
              placeholder="Example: SW-82X7-19Q4"
            />

            <button
              onClick={searchPatient}
              className="primary-button"
            >
              Search
            </button>
          </div>

        </section>


        {found && (
          <section className="patient-result">

            <div className="record-icon">
              <UserRound size={22} />
            </div>

            <div className="record-content">
              <strong>{patient.name}</strong>

              <span>
                Health ID: {patient.healthId}
              </span>

              <small>
                {patient.gender} · DOB: {patient.dob}
              </small>
            </div>

            <button
              onClick={() => navigate("/worker/patient")}
              className="primary-button"
            >
              View Patient
            </button>

          </section>
        )}

      </main>
    </div>
  )
}

export default PatientSearch