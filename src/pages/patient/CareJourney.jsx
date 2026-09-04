import { useNavigate } from "react-router-dom"
import { ArrowLeft, Activity, CalendarDays } from "lucide-react"
import { patient, careJourney } from "../../data/mockData"

function CareJourney() {
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
          <h1>Care Journey</h1>
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
            <p className="eyebrow">CONTINUITY OF CARE</p>
            <h2>Your health journey</h2>
          </div>

          <span>{careJourney.length} events</span>
        </div>

        <div className="journey-list">

          {careJourney.map((item, index) => (
            <div
              key={item.journeyId}
              className="journey-item"
            >

              <div className="journey-line">

                <div className="journey-dot">
                  <Activity size={17} />
                </div>

                {index !== careJourney.length - 1 && (
                  <div className="journey-connector" />
                )}

              </div>

              <div className="journey-content">

                <div className="journey-top">
                  <span>{item.date}</span>

                  <span className="journey-event">
                    {item.event}
                  </span>
                </div>

                <h3>{item.facility}</h3>

                <p>
                  {item.description}
                </p>

                <small>
                  {item.healthWorker}
                </small>

              </div>

            </div>
          ))}

        </div>

      </main>
    </div>
  )
}

export default CareJourney