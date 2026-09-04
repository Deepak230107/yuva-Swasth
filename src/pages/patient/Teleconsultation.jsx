import { useState } from "react"
import { useNavigate } from "react-router-dom"
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

function Teleconsultation() {
  const navigate = useNavigate()

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
            SWASTH
          </p>

          <h1>
            Teleconsultation
          </h1>

        </div>

      </header>


      {/* Consultation Information */}

      <main className="teleconsultation-main">

        <section className="consultation-info">

          <div>

            <span>
              YOUR CONSULTATION
            </span>

            <h2>
              {appointment?.specialty || "Doctor Consultation"}
            </h2>

            <p>
              {appointment?.doctor || "Healthcare Provider"}
            </p>

          </div>

          <div className="secure-consultation">

            <ShieldCheck size={18} />

            <span>
              Secure consultation
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
              Connected
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
                  Camera is off
                </span>
              </div>
            )}

            <div className="patient-video-name">
              You
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
            title={micOn ? "Mute microphone" : "Unmute microphone"}
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
            title={cameraOn ? "Turn off camera" : "Turn on camera"}
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
            title="Open consultation chat"
          >
            <MessageCircle size={21} />
          </button>


          <button
            onClick={endCall}
            className="end-call-button"
            title="End consultation"
          >
            <PhoneOff size={21} />

            <span>
              End
            </span>
          </button>

        </section>


        {/* Chat */}

        {showChat && (
          <section className="consultation-chat">

            <div className="consultation-chat-header">
              <strong>
                Consultation Chat
              </strong>
            </div>

            <div className="consultation-chat-message">
              You are securely connected with your healthcare provider.
            </div>

            <div className="consultation-chat-input">

              <input
                type="text"
                placeholder="Type a message..."
              />

              <button>
                Send
              </button>

            </div>

          </section>
        )}


        {/* Patient Information */}

        <section className="consultation-patient-info">

          <p className="eyebrow">
            PATIENT
          </p>

          <strong>
            {patient.name}
          </strong>

          <span>
            Health ID: {patient.healthId}
          </span>

        </section>

      </main>

    </div>
  )
}

export default Teleconsultation