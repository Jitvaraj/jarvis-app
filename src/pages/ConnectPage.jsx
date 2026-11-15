import { useState, useEffect } from 'react'
import '../styles/jarvis.css'

function ConnectPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [networks, setNetworks] = useState([])
  const [selectedNetwork, setSelectedNetwork] = useState('openai')

  // Mock networks data
  useEffect(() => {
    const mockNetworks = [
      { id: 'openai', name: 'OpenAI Network', status: 'online', models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'] },
      { id: 'anthropic', name: 'Anthropic Network', status: 'online', models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'] },
      { id: 'custom', name: 'Custom Network', status: 'offline', models: [] }
    ]
    setNetworks(mockNetworks)
  }, [])

  const handleConnect = () => {
    setIsConnected(true)
    setTimeout(() => setIsConnected(false), 3000)
  }

  return (
    <div className="hud-panel" style={{ height: '100vh', width: 'calc(100% - 80px)', marginLeft: '80px', padding: '30px' }}>
      <h1 className="holographic" style={{ marginBottom: '30px' }}>NETWORK CONNECTOR</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', height: 'calc(100% - 60px)' }}>
        {/* Network List */}
        <div className="hud-panel" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#0066ff' }}>AVAILABLE NETWORKS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {networks.map((network) => (
              <button
                key={network.id}
                className={`nav-tab ${selectedNetwork === network.id ? 'active' : ''}`}
                onClick={() => setSelectedNetwork(network.id)}
                style={{ textAlign: 'left', padding: '15px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={`status-indicator ${network.status === 'online' ? 'online' : 'offline'}`} />
                  <span>{network.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Network Details */}
        <div className="hud-panel" style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#0066ff' }}>
            NETWORK DETAILS: {selectedNetwork.toUpperCase()}
          </h2>

          {selectedNetwork === 'custom' ? (
            <div>
              <p style={{ color: '#999', marginBottom: '20px' }}>
                Configure your custom AI model endpoint.
              </p>
              <button
                className="nav-tab"
                onClick={() => alert('Custom network configuration would open')}
              >
                CONFIGURE CUSTOM ENDPOINT
              </button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#66ccff' }}>AVAILABLE MODELS</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {networks.find(n => n.id === selectedNetwork)?.models.map((model, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '5px 10px',
                        background: 'rgba(0, 102, 255, 0.2)',
                        border: '1px solid rgba(0, 102, 255, 0.5)',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        color: '#66ccff'
                      }}
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#66ccff' }}>NETWORK STATUS</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={`status-indicator ${networks.find(n => n.id === selectedNetwork)?.status === 'online' ? 'online' : 'offline'}`} />
                  <span>{networks.find(n => n.id === selectedNetwork)?.status.toUpperCase()}</span>
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <button
                  className="nav-tab"
                  onClick={handleConnect}
                  disabled={isConnected}
                >
                  {isConnected ? 'CONNECTING...' : 'CONNECT TO NETWORK'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConnectPage