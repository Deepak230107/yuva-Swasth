import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  X,
  Send,
  ArrowRight,
  FileText,
  Pill,
  FlaskConical,
  CalendarDays,
  HeartPulse,
  Copy,
  MessageCircle
} from "lucide-react"

function Assistant({ onClose }) {
  const navigate = useNavigate()

  const [message, setMessage] = useState("")

  const [messages, setMessages] = useState([
    {
      type: "assistant",
      text: "Hi! I'm your SWASTH Assistant. I can help you find features and navigate your health dashboard. What would you like to do?"
    }
  ])

  const suggestions = [
    {
      label: "Show my health records",
      path: "/records",
      icon: FileText
    },
    {
      label: "Where are my medicines?",
      path: "/medicines",
      icon: Pill
    },
    {
      label: "Show my lab reports",
      path: "/labs",
      icon: FlaskConical
    },
    {
      label: "View my appointments",
      path: "/appointments",
      icon: CalendarDays
    },
    {
      label: "Show my care journey",
      path: "/care-journey",
      icon: HeartPulse
    },
    {
      label: "Find my Health ID",
      path: "/health-id",
      icon: Copy
    }
  ]

  const addAssistantMessage = (text, action = null) => {
    setMessages((previous) => [
      ...previous,
      {
        type: "assistant",
        text,
        action
      }
    ])
  }

  const handleNavigation = (item) => {
    addAssistantMessage(
      `Sure! I'll take you to ${item.label
        .replace("Show my ", "")
        .replace("Where are my ", "")
        .replace("View my ", "")
        .replace("Find my ", "")
        .toLowerCase()}.`
    )

    setTimeout(() => {
      onClose()
      navigate(item.path)
    }, 400)
  }

  const understandMessage = (text) => {
    const lower = text.toLowerCase()

    if (
      lower.includes("medicine") ||
      lower.includes("medication") ||
      lower.includes("tablet") ||
      lower.includes("prescription") ||
      lower.includes("prescribed")
    ) {
      return suggestions[1]
    }

    if (
      lower.includes("lab") ||
      lower.includes("blood test") ||
      lower.includes("test report") ||
      lower.includes("diagnostic") ||
      lower.includes("report")
    ) {
      return suggestions[2]
    }

    if (
      lower.includes("appointment") ||
      lower.includes("doctor visit") ||
      lower.includes("next visit") ||
      lower.includes("schedule")
    ) {
      return suggestions[3]
    }

    if (
      lower.includes("record") ||
      lower.includes("medical history") ||
      lower.includes("health history") ||
      lower.includes("previous visit")
    ) {
      return suggestions[0]
    }

    if (
      lower.includes("health id") ||
      lower.includes("healthid") ||
      lower.includes("patient id") ||
      lower.includes("my id")
    ) {
      return suggestions[5]
    }

    if (
      lower.includes("care journey") ||
      lower.includes("treatment journey") ||
      lower.includes("treatment history")
    ) {
      return suggestions[4]
    }

    if (
      lower.includes("home") ||
      lower.includes("dashboard")
    ) {
      return {
        label: "Go to Home",
        path: "/home",
        icon: MessageCircle
      }
    }

    return null
  }

  const handleSend = () => {
    const text = message.trim()

    if (!text) return

    setMessages((previous) => [
      ...previous,
      {
        type: "user",
        text
      }
    ])

    setMessage("")

    const result = understandMessage(text)

    setTimeout(() => {
      if (result) {
        addAssistantMessage(
          `I can help with that. I'll take you to ${result.label.toLowerCase()}.`,
          result
        )
      } else {
        addAssistantMessage(
          "I can help you navigate SWASTH. You can ask me about your Health ID, health records, medicines, lab reports, appointments or care journey."
        )
      }
    }, 300)
  }

  return (
    <div className="assistant-floating-panel">

      {/* Header */}

      <div className="assistant-header">

        <div className="assistant-brand">

          <div className="assistant-icon">
            <MessageCircle size={19} />
          </div>

          <div>
            <strong>SWASTH AI</strong>
            <span>App Assistant</span>
          </div>

        </div>

        <button
          onClick={onClose}
          className="assistant-close"
          title="Close assistant"
        >
          <X size={19} />
        </button>

      </div>


      {/* Messages */}

      <div className="assistant-content">

        {messages.map((item, index) => (

          <div
            key={index}
            className={
              item.type === "user"
                ? "assistant-user-message"
                : "assistant-message"
            }
          >

            {item.type === "assistant" && (
              <div className="assistant-avatar">
                S
              </div>
            )}

            <div
              className={
                item.type === "user"
                  ? "user-bubble"
                  : "assistant-bubble"
              }
            >

              <p>
                {item.text}
              </p>

              {item.action && (
                <button
                  onClick={() => handleNavigation(item.action)}
                  className="assistant-action-button"
                >
                  <span>
                    Open {item.action.label}
                  </span>

                  <ArrowRight size={15} />
                </button>
              )}

            </div>

          </div>

        ))}


        {/* Quick actions */}

        {messages.length === 1 && (
          <div className="assistant-suggestions">

            <p>QUICK ACTIONS</p>

            {suggestions.map((item) => {

              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item)}
                  className="assistant-suggestion"
                >

                  <div className="suggestion-icon">
                    <Icon size={16} />
                  </div>

                  <span>
                    {item.label}
                  </span>

                  <ArrowRight size={15} />

                </button>
              )
            })}

          </div>
        )}

      </div>


      {/* Input */}

      <div className="assistant-input-area">

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend()
            }
          }}
          placeholder="Ask where to find something..."
        />

        <button
          onClick={handleSend}
          className="assistant-send"
          title="Send"
        >
          <Send size={17} />
        </button>

      </div>

    </div>
  )
}

export default Assistant