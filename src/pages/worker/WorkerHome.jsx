import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Users,
  Search,
  FilePlus,
  Activity,
  ChevronRight,
  LogOut
} from "lucide-react"
import LanguageSelector from "../../components/LanguageSelector"

function WorkerHome() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="home-page">

      {/* Header */}

      <header className="home-header">
        <div
          className="home-header-inner"
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%"
          }}
        >

          <div className="brand">
            <div className="brand-mark">
              S
            </div>

            <span>
              {t("common.brand")}
            </span>
          </div>

          <div
            className="worker-role"
            style={{
              marginLeft: "auto"
            }}
          >
            {t("worker.healthcareWorkerRole")}
          </div>

          <LanguageSelector />

          <button
            onClick={() => navigate("/")}
            title={t("common.logout")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginLeft: "20px",
              padding: "10px 14px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              background: "white",
              color: "#333",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            <LogOut size={18} />
            <span>
              {t("common.logout")}
            </span>
          </button>

        </div>
      </header>


      {/* Main */}

      <main className="home-main">

        {/* Welcome */}

        <section className="welcome-section">

          <p className="eyebrow">
            {t("worker.portalTitle")}
          </p>

          <h1>
            {t("worker.welcomeBack")}
          </h1>

          <p>
            {t("worker.portalSubtitle")}
          </p>

        </section>


        {/* Search Patient */}

        <section className="worker-search-card">

          <div className="worker-search-icon">
            <Search size={24} />
          </div>

          <div>
            <h2>
              {t("worker.findPatient")}
            </h2>

            <p>
              {t("worker.searchHealthIdHint")}
            </p>
          </div>

          <button
            onClick={() => navigate("/worker/search")}
            className="primary-button worker-search-button"
          >
            {t("worker.searchPatient")}
          </button>

        </section>


        {/* Quick Actions */}

        <section>

          <h2 className="section-title">
            {t("worker.quickActions")}
          </h2>

          <div className="feature-grid">

            {/* Patient Records */}

            <button
              onClick={() => navigate("/worker/search")}
              className="feature-card"
            >

              <div className="feature-icon">
                <Users size={23} />
              </div>

              <div>
                <strong>
                  {t("worker.patientRecords")}
                </strong>

                <span>
                  {t("worker.findViewHistory")}
                </span>
              </div>

              <ChevronRight size={19} />

            </button>


            {/* Add Record */}

            <button
              onClick={() => navigate("/worker/search")}
              className="feature-card"
            >

              <div className="feature-icon">
                <FilePlus size={23} />
              </div>

              <div>
                <strong>
                  {t("worker.addRecord")}
                </strong>

                <span>
                  {t("worker.selectPatientFirst")}
                </span>
              </div>

              <ChevronRight size={19} />

            </button>


            {/* Care Activity */}

            <button
              onClick={() => navigate("/worker/search")}
              className="feature-card"
            >

              <div className="feature-icon">
                <Activity size={23} />
              </div>

              <div>
                <strong>
                  {t("worker.careActivity")}
                </strong>

                <span>
                  {t("worker.viewRecentActivity")}
                </span>
              </div>

              <ChevronRight size={19} />

            </button>

          </div>

        </section>

      </main>

    </div>
  )
}

export default WorkerHome