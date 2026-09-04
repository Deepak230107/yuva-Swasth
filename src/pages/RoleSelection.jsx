import { useNavigate } from "react-router-dom"
import { UserRound, Stethoscope } from "lucide-react"

function RoleSelection() {
  const navigate = useNavigate()

  return (
    <div className="role-page">

      <div className="role-container">

        <div className="role-header">
          <p className="module-label">SWASTH</p>

          <h1>How are you accessing SWASTH?</h1>

          <p>
            Select your role to continue.
          </p>
        </div>

        <div className="role-grid">

          <button
            onClick={() => navigate("/login")}
            className="role-card"
          >
            <div className="role-icon">
              <UserRound size={25} />
            </div>

            <div>
              <strong>Patient</strong>
              <span>
                Access your health records and care journey.
              </span>
            </div>
          </button>


          <button
            onClick={() => navigate("/worker-login")}
            className="role-card"
          >
            <div className="role-icon">
              <Stethoscope size={25} />
            </div>

            <div>
              <strong>Healthcare Worker</strong>
              <span>
                Manage patient records and provide care.
              </span>
            </div>
          </button>

        </div>

      </div>

    </div>
  )
}

export default RoleSelection