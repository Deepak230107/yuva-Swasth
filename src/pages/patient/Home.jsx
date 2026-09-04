import { useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  FileText,
  Pill,
  FlaskConical,
  CalendarDays,
  Route,
  MessageCircle,
  ChevronRight,
  X
} from "lucide-react"

import { patient, appointments } from "../../data/mockData"
import Assistant from "../Assistant"

function Home() {

  const navigate = useNavigate()

  const [assistantOpen, setAssistantOpen] = useState(false)

  const features = [
    {
      name: "Health Records",
      icon: FileText,
      path: "/records"
    },
    {
      name: "Medicines",
      icon: Pill,
      path: "/medicines"
    },
    {
      name: "Lab Reports",
      icon: FlaskConical,
      path: "/labs"
    },
    {
      name: "Appointments",
      icon: CalendarDays,
      path: "/appointments"
    },
    {
      name: "Care Journey",
      icon: Route,
      path: "/care-journey"
    }
  ]

  return (
    <div className="home-page">

      {/* Header */}

      <header className="home-header">

        <div className="home-header-inner">

          <div className="brand">
            <div className="brand-mark">
              S
            </div>

            <span>
              SWASTH
            </span>
          </div>

          <button className="profile-button">
            {patient.name.charAt(0)}
          </button>

        </div>

      </header>


      {/* Main */}

      <main className="home-main">

        {/* Welcome */}

        <section className="welcome-section">

          <p className="eyebrow">
            YOUR HEALTH DASHBOARD
          </p>

          <h1>
            Hello, {patient.name.split(" ")[0]}
          </h1>

          <p>
            Your health information, all in one place.
          </p>

        </section>


        {/* Health ID */}

        <section className="health-id-strip">

          <div>

            <span>
              SWASTH Health ID
            </span>

            <strong>
              {patient.healthId}
            </strong>

          </div>

        </section>


        {/* Appointment */}

        <section className="appointment-card">

          <div>

            <p>
              UPCOMING APPOINTMENT
            </p>

            <h2>
              {appointments[0].specialty}
            </h2>

            <span>
              {appointments[0].date} · {appointments[0].time}
            </span>

            <small>
              {appointments[0].facility}
            </small>

          </div>

          <CalendarDays size={28} />

        </section>


        {/* Health Features */}

        <section>

          <h2 className="section-title">
            Your health
          </h2>

          <div className="feature-grid">

            {features.map((feature) => {

              const Icon = feature.icon

              return (
                <button
                  key={feature.name}
                  onClick={() => navigate(feature.path)}
                  className="feature-card"
                >

                  <div className="feature-icon">
                    <Icon size={23} />
                  </div>

                  <div>

                    <strong>
                      {feature.name}
                    </strong>

                    <span>
                      View details
                    </span>

                  </div>

                  <ChevronRight size={19} />

                </button>
              )
            })}

          </div>

        </section>

      </main>


      {/* Floating AI Assistant */}

      {assistantOpen && (
        <Assistant
          onClose={() => setAssistantOpen(false)}
        />
      )}


      {/* AI Button */}

      <button
        onClick={() => setAssistantOpen(!assistantOpen)}
        className="ai-assistant-button"
        title="SWASTH AI Assistant"
      >

        {assistantOpen ? (
          <X size={21} />
        ) : (
          <MessageCircle size={21} />
        )}

      </button>

    </div>
  )
}

export default Home