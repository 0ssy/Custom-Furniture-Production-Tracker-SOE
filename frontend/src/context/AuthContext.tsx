import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch, clearLogin, getSavedUser, saveLogin } from '../services/api'
import type { AuthUser } from '../services/api'

// What every page can get from the context:
// who is logged in, and the login and logout functions.
type AuthContextType = {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// A context is a box of data that any page can open without passing props down
const AuthContext = createContext<AuthContextType | null>(null)

// Wraps the whole app (see main.tsx) so every page can use the login info
export function AuthProvider({ children }: { children: ReactNode }) {
  // Start with the saved user, so a refresh does not log you out
  const [user, setUser] = useState<AuthUser | null>(getSavedUser)

  // Sends the email and password to the backend, then saves what comes back
  async function login(email: string, password: string) {
    const data = await apiFetch<{ token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    saveLogin(data.token, data.user)
    setUser(data.user)
  }

  // Forgets the token and the user
  function logout() {
    clearLogin()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// A short way for pages to open the box: const { user } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}