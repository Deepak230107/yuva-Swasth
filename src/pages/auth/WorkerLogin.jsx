import { useNavigate } from "react-router-dom"
import { ShieldCheck } from "lucide-react"

function WorkerLogin() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#071a2b] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#0d263b] border border-white/10 rounded-2xl p-8">

        <div className="mb-10">
          <div className="worker-login-icon">
            <ShieldCheck size={24} />
          </div>

          <p className="module-label mt-5">
            SWASTH
          </p>

          <h1 className="text-3xl font-bold text-white">
            Healthcare Worker
          </h1>

          <p className="text-gray-400 mt-2">
            Securely access patient records and manage care.
          </p>
        </div>

        <label className="block text-sm font-medium text-white mb-2">
          Worker ID
        </label>

        <input
          type="text"
          placeholder="Enter worker ID"
          className="worker-login-input"
        />

        <label className="block text-sm font-medium text-white mb-2 mt-5">
          Password
        </label>

        <input
          type="password"
          placeholder="Enter password"
          className="worker-login-input"
        />

        <button
          onClick={() => navigate("/worker")}
          className="primary-button w-full mt-6"
        >
          Sign In
        </button>

        <button
          onClick={() => navigate("/")}
          className="worker-back-login"
        >
          Back to patient login
        </button>

      </div>
    </div>
  )
}

export default WorkerLogin