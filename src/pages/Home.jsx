import '../styles/jarvis.css'

function HomePage() {
  return (
    <div className="hud-panel" style={{ height: '100vh', width: 'calc(100% - 80px)', marginLeft: '80px' }}>
      <div className="hud-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <h1 className="holographic" style={{ fontSize: '3rem', marginBottom: '40px' }}>
          WELCOME BACK
        </h1>

        <div className="blue-orb-container">
          <div className="blue-orb" />
        </div>

        <p style={{ fontSize: '1.2rem', color: '#ccc', marginTop: '40px', textAlign: 'center', maxWidth: '600px' }}>
          JARVIS is ready to assist you. System operational.
          <br />
          Your AI assistant interface is active and connected.
        </p>

        <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
          <button
            className="nav-tab"
            onClick={() => window.open('https://openai.com', '_blank')}
          >
            OPEN AI HUB
          </button>
          <button
            className="nav-tab"
            onClick={() => window.open('https://anthropic.com', '_blank')}
          >
            ANTHROPIC HUB
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage