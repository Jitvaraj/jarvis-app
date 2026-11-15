import { useState, useEffect } from 'react'
import '../styles/jarvis.css'

function LogsPage() {
  const [logs, setLogs] = useState([
    { time: '15:30:00', level: 'INFO', message: 'JARVIS system initialized' },
    { time: '15:30:05', level: 'INFO', message: 'API connection established' },
    { time: '15:30:10', level: 'WARN', message: 'No API keys configured' },
    { time: '15:30:15', level: 'INFO', message: 'System ready for user input' }
  ])

  const addLog = (level, message) => {
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', { hour12: false })
    setLogs(prev => [...prev, { time, level, message }].slice(-50))
  }

  return (
    <div className="hud-panel" style={{ height: '100vh', width: 'calc(100% - 80px)', marginLeft: '80px', padding: '30px' }}>
      <h1 className="holographic" style={{ marginBottom: '20px' }}>SYSTEM LOGS</h1>

      <div className="response-log" style={{ height: 'calc(100% - 60px)' }}>
        {logs.map((log, idx) => (
          <div key={idx} style={{ marginBottom: '5px' }}>
            <span style={{ color: '#666' }}>[{log.time}]</span>{' '}
            <span style={{
              color: log.level === 'ERROR' ? '#ff6666' : log.level === 'WARN' ? '#ffcc00' : '#66ccff',
              fontWeight: 'bold'
            }}>
              [{log.level}]
            </span>{' '}
            <span style={{ color: '#ccc' }}>{log.message}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button
          className="nav-tab"
          onClick={() => addLog('INFO', 'Test log entry added')}
        >
          ADD TEST LOG
        </button>
        <button
          className="nav-tab"
          onClick={() => setLogs([])}
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          CLEAR LOGS
        </button>
      </div>
    </div>
  )
}

export default LogsPage