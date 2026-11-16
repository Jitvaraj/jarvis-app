import { useState, useEffect } from 'react'
import '../styles/jarvis.css'

function HUD({ onNavigate, onOpenSettings, currentPage, apiKeys, isOnline }) {
  const [time, setTime] = useState(new Date())

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <div className="hud-panel" style={{ height: '100vh', width: '80px', position: 'fixed', left: 0, top: 0, zIndex: 50 }}>
      <div className="hud-header" style={{ flexDirection: 'column', height: '100%', padding: '10px 0' }}>
        <div className="hud-title" style={{ transform: 'rotate(-90deg)', marginBottom: '30px' }}>
          JARVIS SYSTEM
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
          <button
            className={`nav-tab ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
            style={{ padding: '8px', fontSize: '0.8rem' }}
          >
            HOME
          </button>

          <button
            className={`nav-tab ${currentPage === 'connect' ? 'active' : ''}`}
            onClick={() => onNavigate('connect')}
            style={{ padding: '8px', fontSize: '0.8rem' }}
          >
            CONNECT
          </button>

          <button
            className={`nav-tab ${currentPage === 'logs' ? 'active' : ''}`}
            onClick={() => onNavigate('logs')}
            style={{ padding: '8px', fontSize: '0.8rem' }}
          >
            LOGS
          </button>

          <button
            className="nav-tab"
            onClick={onOpenSettings}
            style={{ padding: '8px', fontSize: '0.8rem' }}
          >
            SETUP
          </button>
        </div>

        <div style={{ marginTop: 'auto', padding: '10px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`} />
            <span className={`status-online ${!isOnline ? 'status-offline' : ''}`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
            {formatTime(time)}
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>
            API KEYS: {Object.keys(apiKeys).length}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HUD
