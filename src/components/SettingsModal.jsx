import { useState, useEffect } from 'react'
import '../styles/jarvis.css'

function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('')
  const [provider, setProvider] = useState('openai')
  const [model, setModel] = useState('gpt-4')
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1')
  const [temperature, setTemperature] = useState(0.7)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Load saved settings
    const savedKeys = localStorage.getItem('jarvis-api-keys')
    const savedSettings = localStorage.getItem('jarvis-settings')

    if (savedKeys) {
      const keys = JSON.parse(savedKeys)
      setApiKey(keys[provider] || '')
    }

    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setModel(settings.model || 'gpt-4')
      setBaseUrl(settings.baseUrl || 'https://api.openai.com/v1')
      setTemperature(settings.temperature || 0.7)
    }
  }, [provider])

  const handleSave = () => {
    const newKeys = { ...JSON.parse(localStorage.getItem('jarvis-api-keys') || '{}'), [provider]: apiKey }
    const newSettings = {
      provider,
      model,
      baseUrl,
      temperature
    }

    localStorage.setItem('jarvis-api-keys', JSON.stringify(newKeys))
    localStorage.setItem('jarvis-settings', JSON.stringify(newSettings))

    // Test connection
    testConnection()
  }

  const testConnection = async () => {
    setIsConnected(true)
    setTimeout(() => setIsConnected(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="hud-panel" style={{ padding: '30px', maxWidth: '500px', width: '90%' }}>
        <h2 className="holographic" style={{ marginBottom: '20px' }}>SYSTEM SETTINGS</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#0066ff' }}>PROVIDER</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="api-key-input"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#0066ff' }}>API KEY</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="api-key-input"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#0066ff' }}>MODEL</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g., gpt-4"
            className="api-key-input"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#0066ff' }}>BASE URL</label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.openai.com/v1"
            className="api-key-input"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#0066ff' }}>TEMPERATURE ({temperature})</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="api-key-input"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            className="nav-tab"
            onClick={handleSave}
            disabled={!apiKey}
          >
            SAVE & TEST
            {isConnected && <span style={{ marginLeft: '10px' }}>✓</span>}
          </button>
          <button
            className="nav-tab"
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.1)' }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal