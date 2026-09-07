import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Activity,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from "lucide-react"

import { patient, careJourney } from "../../data/mockData"

function CareJourney() {
  const navigate = useNavigate()
  const [openReferral, setOpenReferral] = useState(null)

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

          {careJourney.map((item, index) => {

            const isReferral = Boolean(item.referral)
            const isOpen = openReferral === item.journeyId

            return (
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

                  {isReferral && (
                    <>
                      <button
                        className="referral-button"
                        onClick={() =>
                          setOpenReferral(
                            isOpen ? null : item.journeyId
                          )
                        }
                      >
                        {isOpen
                          ? "Hide referral details"
                          : "View referral details"
                        }

                        {isOpen ? (
                          <ChevronUp size={17} />
                        ) : (
                          <ChevronDown size={17} />
                        )}
                      </button>

                      {isOpen && (
                        <div className="referral-details">

                          <div className="referral-status">
                            <span>Referral status</span>
                            <strong>
                              {item.referral.status}
                            </strong>
                          </div>

                          <div className="referral-route">

                            <div>
                              <small>Referred from</small>
                              <strong>
                                {item.referral.from}
                              </strong>
                            </div>

                            <ArrowRight size={20} />

                            <div>
                              <small>Referred to</small>
                              <strong>
                                {item.referral.to}
                              </strong>
                            </div>

                          </div>

                          <div className="referral-info">

                            <div>
                              <small>Department</small>
                              <strong>
                                {item.referral.department}
                              </strong>
                            </div>

                            <div>
                              <small>Reason</small>
                              <strong>
                                {item.referral.reason}
                              </strong>
                            </div>

                          </div>

                          <button
                            className="primary-button referral-action"
                            onClick={() =>
                              navigate("/teleconsultation")
                            }
                          >
                            View Teleconsultation
                            <ArrowRight size={17} />
                          </button>

                        </div>
                      )}
                    </>
                  )}

                </div>

              </div>
            )
          })}

        </div>

      </main>

    </div>
  )
}

export default CareJourney