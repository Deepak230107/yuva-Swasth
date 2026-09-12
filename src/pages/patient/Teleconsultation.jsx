import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MessageCircle,
  ShieldCheck
} from "lucide-react"

import {
  patient,
  appointments
} from "../../data/mockData"
import LanguageSelector from "../../components/LanguageSelector"

function Teleconsultation() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [showChat, setShowChat] = useState(false)

  const appointment = appointments.find(
    (item) => item.status === "Upcoming"
  )

  const endCall = () => {
    navigate("/appointments")
  }

  return (
    <div className="teleconsultation-page">

      {/* Header */}

      <header className="teleconsultation-header">

        <button
          onClick={() => navigate("/appointments")}
          className="back-button"
          title="Back to appointments"
        >
          <ArrowLeft size={20} />
        </button>

        <div>

          <p className="module-label">
            {t("common.brand")}
          </p>

          <h1>
            {t("nav.teleconsultation")}
          </h1>

        </div>

        <div className="module-header-actions">
          <LanguageSelector />
        </div>

      </header>


      {/* Consultation Information */}

      <main className="teleconsultation-main">

        <section className="consultation-info">

          <div>

            <span>
              {t("teleconsultation.yourConsultation")}
            </span>

            <h2>
              {appointment?.specialty || t("teleconsultation.doctorConsultation")}
            </h2>

            <p>
              {appointment?.doctor || t("teleconsultation.healthcareProvider")}
            </p>

          </div>

          <div className="secure-consultation">

            <ShieldCheck size={18} />

            <span>
              {t("teleconsultation.secureConsultation")}
            </span>

          </div>

        </section>


        {/* Video Area */}

        <section className="video-container">

          <div className="doctor-video">

            <div className="doctor-placeholder">
              <span>
                {appointment?.doctor?.charAt(0) || "D"}
              </span>
            </div>

            <div className="video-name">
              {appointment?.doctor || "Doctor"}
            </div>

            <div className="video-status">
              {t("teleconsultation.connected")}
            </div>

          </div>


          {/* Patient Self View */}

          <div className="patient-video">

            {cameraOn ? (
              <div className="patient-camera-placeholder">
                <span>
                  {patient.name.charAt(0)}
                </span>
              </div>
            ) : (
              <div className="camera-off-message">
                <VideoOff size={25} />

                <span>
                  {t("teleconsultation.cameraOff")}
                </span>
              </div>
            )}

            <div className="patient-video-name">
              {t("teleconsultation.you")}
            </div>

          </div>

        </section>


        {/* Controls */}

        <section className="call-controls">

          <button
            onClick={() => setMicOn(!micOn)}
            className={
              micOn
                ? "call-control-button"
                : "call-control-button active"
            }
            title={micOn ? t("teleconsultation.muteMic") : t("teleconsultation.unmuteMic")}
          >
            {micOn ? (
              <Mic size={21} />
            ) : (
              <MicOff size={21} />
            )}
          </button>


          <button
            onClick={() => setCameraOn(!cameraOn)}
            className={
              cameraOn
                ? "call-control-button"
                : "call-control-button active"
            }
            title={cameraOn ? t("teleconsultation.turnOffCamera") : t("teleconsultation.turnOnCamera")}
          >
            {cameraOn ? (
              <Video size={21} />
            ) : (
              <VideoOff size={21} />
            )}
          </button>


          <button
            onClick={() => setShowChat(!showChat)}
            className={
              showChat
                ? "call-control-button active"
                : "call-control-button"
            }
            title={t("teleconsultation.openChat")}
          >
            <MessageCircle size={21} />
          </button>


          <button
            onClick={endCall}
            className="end-call-button"
            title={t("teleconsultation.endConsultation")}
          >
            <PhoneOff size={21} />

            <span>
              {t("common.close")}
            </span>
          </button>

        </section>


        {/* Chat */}

        {showChat && (
          <section className="consultation-chat">

            <div className="consultation-chat-header">
              <strong>
                {t("teleconsultation.consultationChat")}
              </strong>
            </div>

            <div className="consultation-chat-message">
              {t("teleconsultation.secureConnectionMessage")}
            </div>

            <div className="consultation-chat-input">

              <input
                type="text"
                placeholder={t("teleconsultation.typeMessage")}
              />

              <button>
                {t("common.send")}
              </button>

            </div>

          </section>
        )}


        {/* Patient Information */}

        <section className="consultation-patient-info">

          <p className="eyebrow">
            {t("common.patient")}
          </p>

          <strong>
            {patient.name}
          </strong>

          <span>
            {t("healthId.myHealthId")}: {patient.healthId}
          </span>

        </section>

      </main>

    </div>
  )
}

export default Teleconsultation