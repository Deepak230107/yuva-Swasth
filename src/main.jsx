import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n/config'
import './styles.css'
import App from './App.jsx'
import "./i18n/config"

const rootElement = document.getElementById('root')

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)

