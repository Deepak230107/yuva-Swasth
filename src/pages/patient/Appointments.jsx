import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  User,
  Video,
  Navigation
} from "lucide-react"

import {
  patient,
  appointments
} from "../../data/mockData"
import LanguageSelector from "../../components/LanguageSelector"

function Appointments() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="module-page">

      {/* Header */}

      <header className="module-header">

        <button
          onClick={() => navigate("/home")}
          className="back-button"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <p className="module-label">
            {t("common.brand")}
          </p>

          <h1>
            {t("nav.appointments")}
          </h1>
        </div>

        <div className="module-header-actions">
          <LanguageSelector />
        </div>

      </header>


      {/* Main */}

      <main className="module-main">

        {/* Patient Summary */}

        <section className="patient-summary">

          <span>
            {t("common.patient")}
          </span>

          <strong>
            {patient.name}
          </strong>

          <small>
            {t("healthId.myHealthId")}: {patient.healthId}
          </small>

        </section>


        {/* Section Heading */}

        <div className="module-section-heading">

          <div>
            <p className="eyebrow">
              {t("appointments.careSchedule")}
            </p>

            <h2>
              {t("appointments.yourAppointments")}
            </h2>
          </div>

          <span>
            {appointments.length} {t("appointments.appointmentsCount")}
          </span>

        </div>


        {/* Appointment List */}

        <div className="record-list">

          {appointments.map((appointment) => (

            <div
              key={appointment.appointmentId}
              className="appointment-detail-card"
            >

              {/* Icon */}

              <div className="record-icon">
                <CalendarDays size={22} />
              </div>


              {/* Appointment Information */}

              <div className="record-content">

                <strong>
                  {appointment.specialty}
                </strong>

                <span>
                  {appointment.date} · {appointment.time}
                </span>

                <small>
                  <User
                    size={12}
                    style={{
                      display: "inline",
                      marginRight: "4px"
                    }}
                  />

                  {appointment.doctor}
                </small>

                <small>
                  <MapPin
                    size={12}
                    style={{
                      display: "inline",
                      marginRight: "4px"
                    }}
                  />

                  {appointment.facility}
                </small>

              </div>


              {/* Status + Teleconsultation */}

              <div className="appointment-actions">

                <span
                  className={
                    appointment.status === "Upcoming"
                      ? "status-badge"
                      : "status-badge completed"
                  }
                >
                  {appointment.status}
                </span>


                <button
                  onClick={() => navigate("/gps")}
                  className="gps-button"
                >
                  <Navigation size={17} />
                  <span>
                    {t("appointments.getDirections")}
                  </span>
                </button>

                {/* Teleconsultation */}

                {appointment.status === "Upcoming" && (
                  <button
                    onClick={() => navigate("/teleconsultation")}
                    className="teleconsultation-button"
                  >
                    <Video size={17} />

                    <span>
                      {t("appointments.joinTeleconsultation")}
                    </span>
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

      </main>

    </div>
  )
}

export default Appointments