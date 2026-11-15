import { createContext, useContext, useState } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [apiKeys, setApiKeys] = useState({})
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settings, setSettings] = useState({
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    baseUrl: 'https://api.openai.com/v1'
  })

  const updateApiKeys = (newKeys) => {
    setApiKeys(newKeys)
    // Save to localStorage
    localStorage.setItem('jarvis-api-keys', JSON.stringify(newKeys))
  }

  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings })
    localStorage.setItem('jarvis-settings', JSON.stringify({ ...settings, ...newSettings }))
  }

  const openSettings = () => setIsSettingsOpen(true)
  const closeSettings = () => setIsSettingsOpen(false)

  return (
    <SettingsContext.Provider value={{
      apiKeys,
      updateApiKeys,
      settings,
      updateSettings,
      isSettingsOpen,
      openSettings,
      closeSettings
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