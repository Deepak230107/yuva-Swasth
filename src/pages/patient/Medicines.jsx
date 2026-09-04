import { useNavigate } from "react-router-dom"
import { ArrowLeft, Pill, Clock } from "lucide-react"
import { patient, medicines } from "../../data/mockData"

function Medicines() {
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
          <h1>Medicines</h1>
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
            <p className="eyebrow">CURRENT MEDICATION</p>
            <h2>Your medicines</h2>
          </div>

          <span>{medicines.length} medicines</span>
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
                <strong>{medicine.name}</strong>

                <span>
                  {medicine.dosage} · {medicine.frequency}
                </span>

                <small>
                  Duration: {medicine.duration} · Prescribed by {medicine.prescribedBy}
                </small>

                <small>
                  <Clock size={12} style={{ display: "inline", marginRight: "4px" }} />
                  Started {medicine.prescribedDate}
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