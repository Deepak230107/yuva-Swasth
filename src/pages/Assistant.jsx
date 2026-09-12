import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()

  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [messages, setMessages] = useState([
    {
      type: "assistant",
      text: t("assistant.greeting")
    }
  ])

  const suggestions = [
    { label: t("assistant.suggestionRecords"),  path: "/records",      icon: FileText    },
    { label: t("assistant.suggestionMedicines"), path: "/medicines",    icon: Pill        },
    { label: t("assistant.suggestionLabs"),     path: "/labs",         icon: FlaskConical },
    { label: t("assistant.suggestionAppointments"),    path: "/appointments", icon: CalendarDays },
    { label: t("assistant.suggestionCareJourney"),    path: "/care-journey", icon: HeartPulse  },
    { label: t("assistant.suggestionHealthId"),       path: "/health-id",    icon: Copy        }
  ]

  const addAssistantMessage = (text, action = null) => {
    setMessages((prev) => [...prev, { type: "assistant", text, action }])
  }

  const handleNavigation = (item) => {
    addAssistantMessage(
      `${t("assistant.sureTakeYouTo")} ${item.label}`
    )
    setTimeout(() => { onClose(); navigate(item.path) }, 400)
  }

  /** Returns a nav suggestion if the text clearly maps to an app section, else null */
  const detectNavIntent = (text) => {
    const tLower = text.toLowerCase()

    if (tLower.includes("medicine") || tLower.includes("medication") || tLower.includes("tablet") ||
        tLower.includes("prescription") || tLower.includes("prescribed"))
      return suggestions[1]

    if (tLower.includes("lab") || tLower.includes("blood test") || tLower.includes("test report") ||
        tLower.includes("diagnostic") || tLower.includes("report"))
      return suggestions[2]

    if (tLower.includes("appointment") || tLower.includes("doctor visit") ||
        tLower.includes("next visit") || tLower.includes("schedule"))
      return suggestions[3]

    if (tLower.includes("record") || tLower.includes("medical history") ||
        tLower.includes("health history") || tLower.includes("previous visit"))
      return suggestions[0]

    if (tLower.includes("health id") || tLower.includes("healthid") ||
        tLower.includes("patient id") || tLower.includes("my id"))
      return suggestions[5]

    if (tLower.includes("care journey") || tLower.includes("treatment journey") ||
        tLower.includes("treatment history"))
      return suggestions[4]

    if (tLower.includes("home") || tLower.includes("dashboard"))
      return { label: t("nav.home"), path: "/home", icon: MessageCircle }

    return null
  }

  const handleSend = async () => {
    const text = message.trim()
    if (!text || isLoading) return

    setMessages((prev) => [...prev, { type: "user", text }])
    setMessage("")

    const navMatch = detectNavIntent(text)
    if (navMatch) {
      setTimeout(() => {
        addAssistantMessage(
          `${t("assistant.helpTakeYouTo")} ${navMatch.label.toLowerCase()}.`,
          navMatch
        )
      }, 300)
      return
    }

    setIsLoading(true)

    setMessages((prev) => [...prev, { type: "assistant", text: t("assistant.thinking"), isTyping: true }])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question: text, language: "English" })
      })
      const data = await res.json()

      setMessages((prev) => [
        ...prev.filter((m) => !m.isTyping),
        {
          type: "assistant",
          text: data.success
            ? data.answer
            : t("assistant.error")
        }
      ])
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => !m.isTyping),
        {
          type: "assistant",
          text: t("assistant.unavailable")
        }
      ])
    } finally {
      setIsLoading(false)
    }
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
            <strong>{t("common.brand")} AI</strong>
            <span>{t("assistant.appAssistant")}</span>
          </div>
        </div>

        <button onClick={onClose} className="assistant-close" title={t("common.close")}>
          <X size={19} />
        </button>
      </div>

      {/* Messages */}
      <div className="assistant-content">
        {messages.map((item, index) => (
          <div
            key={index}
            className={item.type === "user" ? "assistant-user-message" : "assistant-message"}
          >
            {item.type === "assistant" && (
              <div className="assistant-avatar">S</div>
            )}

            <div className={item.type === "user" ? "user-bubble" : "assistant-bubble"}>
              <p style={item.isTyping ? { opacity: 0.55, fontStyle: "italic" } : {}}>
                {item.text}
              </p>

              {item.action && (
                <button
                  onClick={() => handleNavigation(item.action)}
                  className="assistant-action-button"
                >
                  <span>{t("assistant.open")} {item.action.label}</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Quick actions — visible only before the first user message */}
        {messages.length === 1 && (
          <div className="assistant-suggestions">
            <p>{t("assistant.quickActions")}</p>
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
                  <span>{item.label}</span>
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
          onKeyDown={(e) => { if (e.key === "Enter") handleSend() }}
          placeholder={isLoading ? t("assistant.waitingAi") : t("assistant.askQuestion")}
          disabled={isLoading}
        />

        <button
          onClick={handleSend}
          className="assistant-send"
          title={t("assistant.send")}
          disabled={isLoading}
          style={isLoading ? { opacity: 0.5, cursor: "not-allowed" } : {}}
        >
          <Send size={17} />
        </button>
      </div>

    </div>
  )
}

export default Assistant