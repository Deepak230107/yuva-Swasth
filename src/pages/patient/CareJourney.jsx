import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import LanguageSelector from "../../components/LanguageSelector"

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
  const { t } = useTranslation()

  const [openReferral, setOpenReferral] = useState(null)

  return (
    <div className="module-page">

      <header className="module-header">

        <button
          onClick={() => navigate("/home")}
          className="back-button"
          title={t("back")}
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <p className="module-label">SWASTH</p>

          <h1>
            {t("careJourney")}
          </h1>
        </div>

        <div className="module-header-actions">
          <LanguageSelector />
        </div>

      </header>


      <main className="module-main">

        <section className="patient-summary">

          <span>
            {t("patient")}
          </span>

          <strong>
            {patient.name}
          </strong>

          <small>
            {t("healthId")}: {patient.healthId}
          </small>

        </section>


        <div className="module-section-heading">

          <div>

            <p className="eyebrow">
              {t("continuityOfCare")}
            </p>

            <h2>
              {t("yourHealthJourney")}
            </h2>

          </div>

          <span>
            {careJourney.length} {t("events")}
          </span>

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

                    <span>
                      {item.date}
                    </span>

                    <span className="journey-event">
                      {item.event}
                    </span>

                  </div>


                  <h3>
                    {item.facility}
                  </h3>


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
                          ? t("hideReferralDetails")
                          : t("viewReferralDetails")
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

                            <span>
                              {t("referralStatus")}
                            </span>

                            <strong>
                              {item.referral.status}
                            </strong>

                          </div>


                          <div className="referral-route">

                            <div>

                              <small>
                                {t("referredFrom")}
                              </small>

                              <strong>
                                {item.referral.from}
                              </strong>

                            </div>


                            <ArrowRight size={20} />


                            <div>

                              <small>
                                {t("referredTo")}
                              </small>

                              <strong>
                                {item.referral.to}
                              </strong>

                            </div>

                          </div>


                          <div className="referral-info">

                            <div>

                              <small>
                                {t("department")}
                              </small>

                              <strong>
                                {item.referral.department}
                              </strong>

                            </div>


                            <div>

                              <small>
                                {t("reason")}
                              </small>

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

                            {t("viewTeleconsultation")}

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