import { useNavigate } from "react-router-dom"
import { ArrowLeft, CalendarDays, MapPin, User } from "lucide-react"
import { patient, appointments } from "../../data/mockData"

function Appointments() {
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
          <h1>Appointments</h1>
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
            <p className="eyebrow">CARE SCHEDULE</p>
            <h2>Your appointments</h2>
          </div>

          <span>{appointments.length} appointments</span>
        </div>

        <div className="record-list">

          {appointments.map((appointment) => (
            <div
              key={appointment.appointmentId}
              className="appointment-detail-card"
            >

              <div className="record-icon">
                <CalendarDays size={22} />
              </div>

              <div className="record-content">

                <strong>{appointment.specialty}</strong>

                <span>
                  {appointment.date} · {appointment.time}
                </span>

                <small>
                  <User size={12} style={{ display: "inline", marginRight: "4px" }} />
                  {appointment.doctor}
                </small>

                <small>
                  <MapPin size={12} style={{ display: "inline", marginRight: "4px" }} />
                  {appointment.facility}
                </small>

              </div>

              <span
                className={
                  appointment.status === "Upcoming"
                    ? "status-badge"
                    : "status-badge completed"
                }
              >
                {appointment.status}
              </span>

            </div>
          ))}

        </div>

      </main>
    </div>
  )
}

export default Appointments