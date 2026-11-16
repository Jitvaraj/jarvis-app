import { useState } from 'react'
import '../styles/jarvis.css'
import '../styles/omniroute.css'
import { useSettings } from '../context/SettingsContext'
import { DEFAULT_MODEL, normalizeBaseUrl } from '../context/ApiService'

const labelStyle = { display: 'block', marginBottom: '5px', color: '#0066ff' }
const fieldStyle = { marginBottom: '15px' }
const hintStyle = { fontSize: '0.75rem', color: '#777', marginTop: '4px' }

function SettingsForm({ onClose }) {
  const { apiKeys, settings, connection, saveConnection } = useSettings()
  const [apiKey, setApiKey] = useState(apiKeys.omniroute || '')
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl)
  const [model, setModel] = useState(settings.model)
  const [temperature, setTemperature] = useState(settings.temperature)
  const [result, setResult] = useState(null)

  const handleSave = async () => {
    const url = normalizeBaseUrl(baseUrl)
    setBaseUrl(url)
    setResult({ message: 'Testing connection...' })
    setResult(
      await saveConnection({
        apiKey: apiKey.trim(),
        baseUrl: url,
        model: model.trim() || DEFAULT_MODEL,
        temperature
      })
    )
  }

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
      <div className="hud-panel" style={{
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxSizing: 'border-box',
        textAlign: 'left'
      }}>
        <h2 className="holographic" style={{ marginBottom: '20px' }}>SYSTEM SETTINGS</h2>

        <div style={fieldStyle}>
          <label style={labelStyle}>OMNIROUTE API KEY</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Paste your API key"
            className="api-key-input"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>OMNIROUTE URL</label>
          <input
            type="text"
            inputMode="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://your-omniroute-host/v1"
            className="api-key-input"
            autoCapitalize="off"
            spellCheck={false}
          />
          <div style={hintStyle}>Saved in this browser. Must be reachable from where this app runs.</div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>MODEL</label>
          <input
            type="text"
            list="omniroute-models"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder={DEFAULT_MODEL}
            className="api-key-input"
            autoCapitalize="off"
            spellCheck={false}
          />
          <datalist id="omniroute-models">
            {connection.models.map((id) => <option key={id} value={id} />)}
          </datalist>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>TEMPERATURE ({temperature})</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="api-key-input"
          />
        </div>

        {result && (
          <p style={{
            marginBottom: '15px',
            wordBreak: 'break-word',
            color: result.ok ? '#66ff99' : result.ok === false ? '#ff6666' : '#66ccff'
          }}>
            {result.ok ? '✓ ' : ''}{result.message}
          </p>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="hud-button"
            onClick={handleSave}
            disabled={!apiKey.trim() || !baseUrl.trim()}
          >
            SAVE & TEST
          </button>
          <button className="hud-button" onClick={onClose}>CLOSE</button>
        </div>
      </div>
    </div>
  )
}

function SettingsModal({ isOpen, onClose }) {
  return isOpen ? <SettingsForm onClose={onClose} /> : null
}

export default SettingsModal
