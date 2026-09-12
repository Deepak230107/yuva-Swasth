import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import ThemeToggle from "../../components/ThemeToggle"

import {
  FileText,
  Pill,
  FlaskConical,
  CalendarDays,
  Route,
  MessageCircle,
  ChevronRight,
  X,
  LogOut,
  MapPin
} from "lucide-react"

import { patient, appointments } from "../../data/mockData"
import Assistant from "../Assistant"
import LanguageSelector from "../../components/LanguageSelector"

function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [assistantOpen, setAssistantOpen] = useState(false)

  const features = [
    {
      name: "Health Records",
      label: t("healthRecords"),
      icon: FileText,
      path: "/records"
    },
    {
      name: "Medicines",
      label: t("medicines"),
      icon: Pill,
      path: "/medicines"
    },
    {
      name: "Lab Reports",
      label: t("labReports"),
      icon: FlaskConical,
      path: "/labs"
    },
    {
      name: "Appointments",
      label: t("appointments"),
      icon: CalendarDays,
      path: "/appointments"
    },
    {
      name: "Care Journey",
      label: t("careJourney"),
      icon: Route,
      path: "/care-journey"
    },
    {
      name: "Medical GPS",
      label: t("medicalGps", "Medical GPS"),
      icon: MapPin,
      path: "/gps"
    }
  ]

  const handleLogout = () => {
    navigate("/")
  }

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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >

            <LanguageSelector />

            <ThemeToggle />

            <button
              className="profile-button"
              onClick={handleLogout}
              title={t("logout")}
            >
              <LogOut size={20} />
            </button>

          </div>

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
            {t("yourHealth")}
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
                      {feature.label}
                    </strong>

                    <span>
                      {t("viewDetails")}
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
        title={t("healthAssistant")}
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