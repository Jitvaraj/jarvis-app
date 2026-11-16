import { createContext, useContext, useEffect, useRef, useState } from 'react'
import api, { DEFAULT_BASE_URL, DEFAULT_MODEL, normalizeBaseUrl } from './ApiService'

const SettingsContext = createContext()

const KEY_STORE = 'jarvis-omniroute-key'
const SETTINGS_STORE = 'jarvis-omniroute-settings'

const read = (name) => {
  try {
    return localStorage.getItem(name)
  } catch {
    return null
  }
}

const write = (name, value) => {
  try {
    localStorage.setItem(name, value)
  } catch {
    // storage unavailable (private mode) - settings just won't persist
  }
}

function loadSettings() {
  const defaults = { baseUrl: DEFAULT_BASE_URL, model: DEFAULT_MODEL, temperature: 0.7 }
  try {
    return { ...defaults, ...JSON.parse(read(SETTINGS_STORE) || '{}') }
  } catch {
    return defaults
  }
}

export function SettingsProvider({ children }) {
  const [apiKey, setApiKey] = useState(() => read(KEY_STORE) || '')
  const [settings, setSettings] = useState(loadSettings)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [connection, setConnection] = useState({ status: 'idle', models: [] })
  const testId = useRef(0)

  // Keep the API client in sync with whatever is saved
  useEffect(() => {
    api.configure({ apiKey, ...settings })
  }, [apiKey, settings])

  // Check the connection (GET /models) with the given key + URL
  const runTest = async (cfg) => {
    const id = ++testId.current
    if (!cfg.apiKey || !cfg.baseUrl) {
      setConnection({ status: 'idle', models: [] })
      return { ok: false, message: 'Add your OmniRoute API key and URL first.' }
    }
    setConnection((c) => ({ ...c, status: 'checking' }))
    api.configure(cfg)
    const result = await api.testConnection()
    if (id === testId.current) {
      setConnection({ status: result.ok ? 'online' : 'error', models: result.models })
    }
    return result
  }

  // Check the saved connection once on startup
  useEffect(() => {
    runTest({ apiKey, ...settings })
  }, [])

  const saveConnection = ({ apiKey: key, ...patch }) => {
    const next = { ...settings, ...patch, baseUrl: normalizeBaseUrl(patch.baseUrl) }
    setApiKey(key)
    setSettings(next)
    write(KEY_STORE, key)
    write(SETTINGS_STORE, JSON.stringify(next))
    return runTest({ apiKey: key, ...next })
  }

  return (
    <SettingsContext.Provider value={{
      apiKeys: apiKey ? { omniroute: apiKey } : {},
      settings,
      connection,
      saveConnection,
      isSettingsOpen,
      openSettings: () => setIsSettingsOpen(true),
      closeSettings: () => setIsSettingsOpen(false)
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
