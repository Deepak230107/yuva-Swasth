import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  UserRound,
  FileText,
  Pill,
  FlaskConical,
  CalendarDays
} from "lucide-react"

import {
  patient,
  medicalRecords,
  medicines,
  labReports,
  appointments
} from "../../data/mockData"

function PatientOverview() {
  const navigate = useNavigate()

  return (
    <div className="module-page">

      <header className="module-header">

        <button
          onClick={() => navigate("/worker/search")}
          className="back-button"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <p className="module-label">SWASTH</p>
          <h1>Patient Overview</h1>
        </div>

      </header>


      <main className="module-main">

        {/* Patient Information */}

        <section className="worker-patient-card">

          <div className="patient-avatar">
            <UserRound size={28} />
          </div>

          <div>

            <p className="eyebrow">
              PATIENT
            </p>

            <h2>
              {patient.name}
            </h2>

            <p>
              Health ID: <strong>{patient.healthId}</strong>
            </p>

            <span>
              {patient.gender}
              {" · "}
              DOB: {patient.dob}
              {" · "}
              Blood Group: {patient.bloodGroup}
            </span>

          </div>

        </section>


        {/* Patient Overview */}

        <section>

          <h2 className="section-title">
            Patient overview
          </h2>

          <div className="worker-stat-grid">

            <div className="worker-stat-card">

              <FileText size={21} />

              <strong>
                {medicalRecords.length}
              </strong>

              <span>
                Medical records
              </span>

            </div>


            <div className="worker-stat-card">

              <Pill size={21} />

              <strong>
                {medicines.length}
              </strong>

              <span>
                Active medicines
              </span>

            </div>


            <div className="worker-stat-card">

              <FlaskConical size={21} />

              <strong>
                {labReports.length}
              </strong>

              <span>
                Lab reports
              </span>

            </div>


            <div className="worker-stat-card">

              <CalendarDays size={21} />

              <strong>
                {appointments.length}
              </strong>

              <span>
                Appointments
              </span>

            </div>

          </div>

        </section>


        {/* Patient Actions */}

        <section>

          <h2 className="section-title">
            Patient actions
          </h2>

          <div className="worker-action-grid">


            {/* Add Consultation */}

            <button
              onClick={() => navigate("/worker/add-record")}
              className="worker-action-card"
            >

              <FileText size={22} />

              <div>

                <strong>
                  Add consultation
                </strong>

                <span>
                  Create a new medical record
                </span>

              </div>

            </button>


            {/* Prescribe Medicine */}

            <button
              onClick={() => navigate("/worker/add-medicine")}
              className="worker-action-card"
            >

              <Pill size={22} />

              <div>

                <strong>
                  Prescribe medicine
                </strong>

                <span>
                  Add a medication to the patient record
                </span>

              </div>

            </button>


            {/* Add Lab Result */}

            <button
              onClick={() => navigate("/worker/add-lab")}
              className="worker-action-card"
            >

              <FlaskConical size={22} />

              <div>

                <strong>
                  Add lab result
                </strong>

                <span>
                  Record a diagnostic result
                </span>

              </div>

            </button>


          </div>

        </section>

      </main>

    </div>
  )
}

export default PatientOverview