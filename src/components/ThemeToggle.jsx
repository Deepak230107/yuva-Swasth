import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

function ThemeToggle() {
  const [isLight, setIsLight] = useState(
    localStorage.getItem("theme") === "light"
  )

  useEffect(() => {
    document.body.classList.toggle("light", isLight)

    localStorage.setItem(
      "theme",
      isLight ? "light" : "dark"
    )
  }, [isLight])

  return (
    <button
      onClick={() => setIsLight((current) => !current)}
      aria-label={
        isLight
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
      style={{
        width: "42px",
        height: "42px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        background: "var(--card)",
        color: "var(--text)",
        cursor: "pointer"
      }}
    >
      {isLight ? (
        <Moon size={19} />
      ) : (
        <Sun size={19} />
      )}
    </button>
  )
}

export default ThemeToggle