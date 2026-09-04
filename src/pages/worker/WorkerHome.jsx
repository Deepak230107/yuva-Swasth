import { useNavigate } from "react-router-dom"
import {
  Users,
  Search,
  FilePlus,
  Activity,
  ChevronRight
} from "lucide-react"

function WorkerHome() {
  const navigate = useNavigate()

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

          <div className="worker-role">
            HEALTHCARE WORKER
          </div>

        </div>
      </header>


      {/* Main */}

      <main className="home-main">

        {/* Welcome */}

        <section className="welcome-section">

          <p className="eyebrow">
            HEALTHCARE WORKER PORTAL
          </p>

          <h1>
            Welcome back
          </h1>

          <p>
            Access patient information and manage care records.
          </p>

        </section>


        {/* Search Patient */}

        <section className="worker-search-card">

          <div className="worker-search-icon">
            <Search size={24} />
          </div>

          <div>
            <h2>
              Find a patient
            </h2>

            <p>
              Search using the patient's SWASTH Health ID.
            </p>
          </div>

          <button
            onClick={() => navigate("/worker/search")}
            className="primary-button worker-search-button"
          >
            Search Patient
          </button>

        </section>


        {/* Quick Actions */}

        <section>

          <h2 className="section-title">
            Quick actions
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
                  Patient Records
                </strong>

                <span>
                  Find and view patient history
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
                  Add Record
                </strong>

                <span>
                  Select a patient first
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
                  Care Activity
                </strong>

                <span>
                  View recent patient activity
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