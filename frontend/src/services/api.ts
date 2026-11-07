// This file is the only place that talks to Jose's backend.
// Every page uses apiFetch, so the token and the errors are handled once.

// The backend runs on port 5000 (from the requirements file)
export const API_URL = 'http://localhost:5000/api'

// Names used to save the login in the browser, so it survives a refresh
const TOKEN_KEY = 'token'
const USER_KEY = 'user'

// The logged-in user, in the shape Jose's login sends back
export type AuthUser = {
  id: string
  fullName: string
  email: string
  role: 'Admin' | 'Staff'
}

// Reads the saved token (null if nobody is logged in)
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// Reads the saved user. If the saved text is broken we return null.
export function getSavedUser(): AuthUser | null {
  try {
    const text = localStorage.getItem(USER_KEY)
    return text ? (JSON.parse(text) as AuthUser) : null
  } catch {
    return null
  }
}

// Saves the token and user after a successful login
export function saveLogin(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

// Removes the saved login (used for logout)
export function clearLogin() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// Sends a request to the backend and gives back the JSON answer.
// path is the part after /api, for example '/customers'.
// <T> lets each page say what shape of data it expects back.
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  // Tell the backend we send JSON. If we have a token, send it too.
  // The backend checks the "Bearer <token>" text on every protected route.
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch {
    // fetch only fails like this when the server cannot be reached at all
    throw new Error('Cannot reach the server. Is the backend running on port 5000?')
  }

  // Read the answer. If it is not valid JSON we use an empty object.
  const data: unknown = await response.json().catch(() => ({}))

  if (!response.ok) {
    // 401 on a normal page means the token is missing, wrong or expired,
    // so we log the user out and send them to the login page.
    // We skip this for /auth paths, because a wrong password also gives 401.
    if (response.status === 401 && token && !path.startsWith('/auth')) {
      clearLogin()
      window.location.href = '/login'
    }
    // The backend sends errors like { message: "..." }, so we show that text
    const message = (data as { message?: string }).message
    throw new Error(message || 'Something went wrong')
  }

  return data as T
}