import { useState } from 'react'
import './App.css'
import HUD from './components/HUD'
import HomePage from './pages/Home'
import ConnectPage from './pages/ConnectPage'
import LogsPage from './pages/Logs'
import { SettingsProvider, useSettings } from './context/SettingsContext'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const { apiKeys } = useSettings()

  return (
    <div className="jarvis-hud-container">
      <HUD onNavigate={setCurrentPage} currentPage={currentPage} apiKeys={apiKeys} />
      <div className="page-content">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'connect' && <ConnectPage />}
        {currentPage === 'logs' && <LogsPage />}
      </div>
    </div>
  )
}

export default App