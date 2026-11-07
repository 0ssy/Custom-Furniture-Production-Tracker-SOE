import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../services/api'

function Login() {
  const { user, login } = useAuth()

  // 'login' or 'register': the same page does both
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // One error message shown above the button
  const [error, setError] = useState('')
  // true while we wait for the backend, so the button cannot be clicked twice
  const [loading, setLoading] = useState(false)

  // Already logged in? Go straight to the dashboard.
  if (user) {
    return <Navigate to="/" replace />
  }

  // Checks the inputs and returns an error text, or '' if all is fine
  function validate() {
    if (mode === 'register' && fullName.trim().length < 2) {
      return 'Full name must be at least 2 characters'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return 'Please enter a valid email'
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    return ''
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    setError('')

    const problem = validate()
    if (problem) {
      setError(problem)
      return
    }

    setLoading(true)
    try {
      if (mode === 'register') {
        // Create the account first (the backend makes it a Staff user)
        await apiFetch('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            password,
          }),
        })
      }
      // Then log in. When it works, "user" is set and the page redirects.
      await login(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-1">Furniture Tracker</h1>
        <p className="text-gray-500 mb-4">
          {mode === 'login' ? 'Log in to continue' : 'Create a staff account'}
        </p>

        {/* Full name only shows when registering */}
        {mode === 'register' && (
          <div className="mb-3">
            <label className="block text-sm mb-1">Full Name</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Password</label>
          {/* type="password" hides the letters */}
          <input
            type="password"
            className="w-full border rounded px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-amber-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-300"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Register'}
        </button>

        {/* Switch between the two modes */}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setError('')
          }}
          className="text-amber-700 underline text-sm mt-3"
        >
          {mode === 'login' ? 'No account? Register' : 'Have an account? Log in'}
        </button>
      </form>
    </div>
  )
}

export default Login