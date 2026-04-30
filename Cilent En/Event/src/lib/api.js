import { getToken } from './auth.js'

function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) return envUrl

  // Force deployed backend as default (no localhost fallback).
  return 'https://eventserver-weld.vercel.app'
}

const API_URL = getApiBaseUrl()

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch (error) {
    throw new Error(
      'Network error: cannot reach API. Set VITE_API_URL to your deployed backend URL in Vercel.'
    )
  }

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : await res.text()

  if (!isJson) {
    throw new Error(
      'API misconfiguration: expected JSON response. Ensure VITE_API_URL points to your backend API.'
    )
  }

  if (!res.ok) {
    const message = data?.message || 'Request failed'
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export function login(email, password) {
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }).then((data) => {
    if (!data?.token) {
      throw new Error('Login failed: backend did not return a token')
    }
    return data
  })
}

export function fetchEvents() {
  return request('/api/events')
}

export function fetchStats() {
  return request('/api/events/stats')
}

export function createEvent(payload) {
  return request('/api/events', { method: 'POST', body: JSON.stringify(payload) })
}

