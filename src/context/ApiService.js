// API Service for JARVIS - Can call any endpoint with user-provided keys
const API_BASE_URL = 'http://localhost:3001/api'

export class ApiService {
  constructor() {
    this.provider = null
    this.apiKeys = {}
    this.settings = {}
  }

  configure(provider, apiKeys, settings) {
    this.provider = provider
    this.apiKeys = apiKeys
    this.settings = settings
  }

  async callEndpoint(method, path, body = null) {
    try {
      const url = `${API_BASE_URL}${path}`

      const headers = {
        'Content-Type': 'application/json'
      }

      // Add provider-specific headers if available
      if (this.provider === 'openai' && this.apiKeys.openai) {
        headers['Authorization'] = `Bearer ${this.apiKeys.openai}`
      } else if (this.provider === 'anthropic' && this.apiKeys.anthropic) {
        headers['x-api-key'] = this.apiKeys.anthropic
        headers['anthropic-version'] = '2023-06-01'
      }

      // Add custom headers from settings
      if (this.settings.customHeaders) {
        Object.assign(headers, this.settings.customHeaders)
      }

      const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      }

      // For now, we'll use fetch to make the actual API call
      // In a real implementation, this would forward to the actual API endpoint
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Service error:', error)
      throw error
    }
  }

  async chatCompletion(messages) {
    if (!this.provider || !this.apiKeys) {
      throw new Error('No provider configured or API keys provided')
    }

    const endpoint = this.provider === 'openai' ? '/v1/chat/completions' : '/v1/messages'

    return this.callEndpoint('POST', endpoint, {
      model: this.settings.model || 'gpt-4',
      messages,
      temperature: this.settings.temperature || 0.7,
      max_tokens: this.settings.maxTokens || 1000
    })
  }

  async getModels() {
    return this.callEndpoint('GET', '/models')
  }

  async testConnection() {
    try {
      return await this.callEndpoint('GET', '/health')
    } catch (error) {
      return { status: 'error', message: error.message }
    }
  }
}

// Singleton instance
export default new ApiService()