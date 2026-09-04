import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  User,
  Video
} from "lucide-react"

import {
  patient,
  appointments
} from "../../data/mockData"

function Appointments() {
  const navigate = useNavigate()

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
            SWASTH
          </p>

          <h1>
            Appointments
          </h1>
        </div>

      </header>


      {/* Main */}

      <main className="module-main">

        {/* Patient Summary */}

        <section className="patient-summary">

          <span>
            Patient
          </span>

          <strong>
            {patient.name}
          </strong>

          <small>
            Health ID: {patient.healthId}
          </small>

        </section>


        {/* Section Heading */}

        <div className="module-section-heading">

          <div>
            <p className="eyebrow">
              CARE SCHEDULE
            </p>

            <h2>
              Your appointments
            </h2>
          </div>

          <span>
            {appointments.length} appointments
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


                {/* Teleconsultation */}

                {appointment.status === "Upcoming" && (
                  <button
                    onClick={() => navigate("/teleconsultation")}
                    className="teleconsultation-button"
                  >
                    <Video size={17} />

                    <span>
                      Join Teleconsultation
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