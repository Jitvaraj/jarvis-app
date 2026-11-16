import { useEffect, useRef, useState } from 'react'
import '../styles/jarvis.css'
import '../styles/omniroute.css'
import api from '../context/ApiService'
import { useSettings } from '../context/SettingsContext'

const SYSTEM = { role: 'system', content: 'You are JARVIS, a concise and helpful AI assistant.' }

function HomePage() {
  const { apiKeys, settings, openSettings } = useSettings()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const logRef = useRef(null)
  const ready = Boolean(apiKeys.omniroute && settings.baseUrl)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages, busy])

  const send = async (event) => {
    event.preventDefault()
    const text = input.trim()
    if (!text || busy || !ready) return

    const user = { role: 'user', content: text }
    const history = [...messages.filter((m) => !m.failed && !m.error), user].slice(-20)
    setMessages((m) => [...m, user])
    setInput('')
    setBusy(true)

    try {
      const reply = await api.chatCompletion([SYSTEM, ...history])
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch (error) {
      setMessages((m) => [
        ...m.slice(0, -1),
        { ...user, failed: true },
        { role: 'assistant', content: error.message, error: true }
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="hud-panel" style={{ height: '100vh', width: 'calc(100% - 80px)', marginLeft: '80px', display: 'flex', flexDirection: 'column' }}>
      <div className="hud-content" style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 className="holographic" style={{ fontSize: '3rem', marginBottom: '40px' }}>
            WELCOME BACK
          </h1>

          <div className="blue-orb-container">
            <div className={`blue-orb${busy ? ' thinking' : ''}`} />
          </div>

          <p style={{ fontSize: '1.2rem', color: '#ccc', marginTop: '40px', textAlign: 'center', maxWidth: '600px' }}>
            {ready ? (
              <>
                JARVIS is ready to assist you. System operational.
                <br />
                Your AI assistant interface is active and connected.
              </>
            ) : (
              'Add your OmniRoute API key to bring JARVIS online.'
            )}
          </p>

          <div style={{ marginTop: '40px', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {!ready && (
              <button className="hud-button" onClick={openSettings}>ENTER API KEY</button>
            )}
            <button className="nav-tab" onClick={() => window.open('https://openai.com', '_blank')}>
              OPEN AI HUB
            </button>
            <button className="nav-tab" onClick={() => window.open('https://anthropic.com', '_blank')}>
              ANTHROPIC HUB
            </button>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="response-log" ref={logRef} style={{ margin: '0 20px', textAlign: 'left', flexShrink: 0, maxHeight: '30vh' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: '8px', color: m.error ? '#ff6666' : '#ccc' }}>
              <b style={{ color: m.role === 'user' ? '#66ccff' : m.error ? '#ff6666' : '#0066ff' }}>
                {m.role === 'user' ? 'YOU' : m.error ? 'ERROR' : 'JARVIS'}&gt;
              </b>{' '}
              {m.content}
            </div>
          ))}
          {busy && <div style={{ color: '#66ccff' }}>JARVIS&gt; thinking...</div>}
        </div>
      )}

      <form onSubmit={send} style={{ display: 'flex', gap: '10px', padding: '20px', flexShrink: 0 }}>
        <input
          className="command-input"
          style={{ flex: 1, minWidth: 0 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={ready ? 'Ask JARVIS...' : 'Add your API key to begin'}
          disabled={!ready}
        />
        <button className="hud-button" type="submit" disabled={!ready || busy || !input.trim()}>
          SEND
        </button>
      </form>
    </div>
  )
}

export default HomePage
