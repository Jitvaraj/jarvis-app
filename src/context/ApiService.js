// JARVIS API client - talks straight to an OmniRoute gateway (OpenAI-compatible /v1 API)
// from the browser using just a Bearer API key. No local backend required.

export const DEFAULT_BASE_URL = import.meta.env.VITE_OMNIROUTE_BASE_URL || ''
export const DEFAULT_MODEL = 'auto'

const LOCAL = /^(localhost|127\.|0\.0\.0\.0|\[::1\]|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i

// "host", "host/v1" or ".../v1/chat/completions"  ->  "https://host/v1"
export function normalizeBaseUrl(input) {
  let url = String(input || '').trim()
  if (!url) return ''
  if (!/^https?:\/\//i.test(url)) url = `${LOCAL.test(url) ? 'http' : 'https'}://${url}`
  url = url.replace(/\/+$/, '').replace(/\/(chat\/completions|models)$/i, '')
  return /\/v1$/i.test(url) ? url : `${url}/v1`
}

export class ApiService {
  constructor() {
    this.apiKey = ''
    this.baseUrl = ''
    this.settings = {}
  }

  configure({ apiKey, baseUrl, ...settings }) {
    this.apiKey = apiKey || ''
    this.baseUrl = normalizeBaseUrl(baseUrl)
    this.settings = settings
  }

  async request(method, path, body, timeoutMs = 30000) {
    if (!this.apiKey || !this.baseUrl) {
      throw new Error('Add your OmniRoute API key and URL in SETUP first.')
    }

    let response
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          ...(body && { 'Content-Type': 'application/json' })
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(timeoutMs)
      })
    } catch (error) {
      if (error.name === 'TimeoutError') throw new Error('OmniRoute took too long to answer.')
      throw new Error(
        `Can't reach ${this.baseUrl}. Check the URL, that OmniRoute is online, and that it allows this site (CORS). https pages can't call http:// URLs.`
      )
    }

    if (!response.ok) {
      if (response.status === 401) throw new Error('API key rejected (401). Check it in SETUP.')
      const data = await response.json().catch(() => ({}))
      const detail = data?.error?.message || data?.message || response.statusText
      throw new Error(`OmniRoute error ${response.status}${detail ? `: ${detail}` : ''}`)
    }
    return response.json()
  }

  async chatCompletion(messages) {
    const data = await this.request(
      'POST',
      '/chat/completions',
      {
        model: this.settings.model || DEFAULT_MODEL,
        messages,
        temperature: this.settings.temperature ?? 0.7,
        stream: false
      },
      120000
    )

    const content = data?.choices?.[0]?.message?.content
    const text = Array.isArray(content) ? content.map((part) => part?.text || '').join('') : content
    if (!text) throw new Error('OmniRoute returned an empty reply.')
    return text
  }

  async getModels() {
    const data = await this.request('GET', '/models')
    const list = Array.isArray(data) ? data : data?.data || []
    return list.map((model) => (typeof model === 'string' ? model : model?.id)).filter(Boolean)
  }

  async testConnection() {
    try {
      const models = await this.getModels()
      return {
        ok: true,
        models,
        message: `Connected. ${models.length} model${models.length === 1 ? '' : 's'} available.`
      }
    } catch (error) {
      return { ok: false, models: [], message: error.message }
    }
  }
}

// Singleton instance
export default new ApiService()
