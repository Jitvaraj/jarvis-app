import { useState } from 'react'
import './App.css'
import HUD from './components/HUD'
import SettingsModal from './components/SettingsModal'
import HomePage from './pages/Home'
import ConnectPage from './pages/ConnectPage'
import LogsPage from './pages/Logs'
import { useSettings } from './context/SettingsContext'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const { apiKeys, connection, isSettingsOpen, openSettings, closeSettings } = useSettings()

  return (
    <div className="jarvis-hud-container">
      <HUD
        onNavigate={setCurrentPage}
        onOpenSettings={openSettings}
        currentPage={currentPage}
        apiKeys={apiKeys}
        isOnline={connection.status === 'online'}
      />
      <div className="page-content">
        {/* Home stays mounted (just hidden) so the conversation survives switching tabs */}
        <div style={{ display: currentPage === 'home' ? 'block' : 'none' }}>
          <HomePage />
        </div>
        {currentPage === 'connect' && <ConnectPage />}
        {currentPage === 'logs' && <LogsPage />}
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
    </div>
  )
}

export default App
