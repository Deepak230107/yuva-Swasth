import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
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
import LanguageSelector from "../../components/LanguageSelector"

function PatientOverview() {
  const navigate = useNavigate()
  const { t } = useTranslation()

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
          <p className="module-label">{t("common.brand")}</p>
          <h1>{t("worker.patientOverview")}</h1>
        </div>

        <div className="module-header-actions">
          <LanguageSelector />
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
              {t("worker.patient")}
            </p>

            <h2>
              {patient.name}
            </h2>

            <p>
              {t("healthId.myHealthId")}: <strong>{patient.healthId}</strong>
            </p>

            <span>
              {patient.gender}
              {" · "}
              {t("auth.dob")}: {patient.dob}
              {" · "}
              {t("worker.bloodGroup")}: {patient.bloodGroup}
            </span>

          </div>

        </section>


        {/* Patient Overview */}

        <section>

          <h2 className="section-title">
            {t("worker.patientOverviewTitle")}
          </h2>

          <div className="worker-stat-grid">

            <div className="worker-stat-card">

              <FileText size={21} />

              <strong>
                {medicalRecords.length}
              </strong>

              <span>
                {t("worker.medicalRecords")}
              </span>

            </div>


            <div className="worker-stat-card">

              <Pill size={21} />

              <strong>
                {medicines.length}
              </strong>

              <span>
                {t("worker.activeMedicines")}
              </span>

            </div>


            <div className="worker-stat-card">

              <FlaskConical size={21} />

              <strong>
                {labReports.length}
              </strong>

              <span>
                {t("worker.labReports")}
              </span>

            </div>


            <div className="worker-stat-card">

              <CalendarDays size={21} />

              <strong>
                {appointments.length}
              </strong>

              <span>
                {t("appointments.myAppointments")}
              </span>

            </div>

          </div>

        </section>


        {/* Patient Actions */}

        <section>

          <h2 className="section-title">
            {t("worker.patientActions")}
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
                  {t("worker.addConsultation")}
                </strong>

                <span>
                  {t("worker.createMedicalRecord")}
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
                  {t("worker.prescribeMedicine")}
                </strong>

                <span>
                  {t("worker.addMedicationRecord")}
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
                  {t("worker.addLabResult")}
                </strong>

                <span>
                  {t("worker.recordDiagnosticResult")}
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