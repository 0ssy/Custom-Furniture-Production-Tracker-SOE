import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { ApiUser } from '../types/user'
import { ROLES, apiFetch } from '../services/api'
import type { UserRole } from '../services/api'
import { extractList } from '../services/list'
import { useAuth } from '../context/AuthContext'

function Users() {
  // The logged-in Administrator. We use their id to stop them changing themselves.
  const { user: me } = useAuth()

  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')

  // The "create account" form
  const [showForm, setShowForm] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('Sales')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  // Gets all users from the backend ({ count, users })
  const loadUsers = useCallback(async () => {
    try {
      const data = await apiFetch<unknown>('/users')
      setUsers(extractList<ApiUser>(data, 'users'))
      setLoadError('')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Could not load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  // Creates a new account. The backend checks that we are an Administrator.
  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    setFormError('')

    if (fullName.trim().length < 2) return setFormError('Full name must be at least 2 characters')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setFormError('Please enter a valid email')
    // Jose's backend needs at least 8 characters
    if (password.length < 8) return setFormError('Password must be at least 8 characters')

    setSaving(true)
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), password, role }),
      })
      setFullName('')
      setEmail('')
      setPassword('')
      setRole('Sales')
      setShowForm(false)
      await loadUsers()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not create the account')
    } finally {
      setSaving(false)
    }
  }

  // Changes a user's role (PUT /users/:id/role)
  async function changeRole(u: ApiUser, newRole: UserRole) {
    setActionError('')
    try {
      await apiFetch(`/users/${u._id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      })
      await loadUsers()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not change the role')
    }
  }

  async function handleDelete(u: ApiUser) {
    if (!window.confirm(`Delete the account of ${u.fullName}? This cannot be undone.`)) return
    setActionError('')
    try {
      await apiFetch(`/users/${u._id}`, { method: 'DELETE' })
      await loadUsers()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete the account')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Accounts</h2>
        <button
          onClick={() => {
            setShowForm(true)
            setFormError('')
          }}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Create Account
        </button>
      </div>

      {actionError && <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{actionError}</p>}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-lg font-bold mb-3">Create Account</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Full Name *</label>
              <input className="w-full border rounded px-2 py-1" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Email *</label>
              <input className="w-full border rounded px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Temporary Password * (8+ characters)</label>
              <input type="password" className="w-full border rounded px-2 py-1" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Role *</label>
              <select className="w-full border rounded px-2 py-1" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {formError && <p className="text-red-600 text-sm mt-2">{formError}</p>}
          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={saving} className="bg-amber-600 text-white px-4 py-1 rounded disabled:bg-gray-300">
              {saving ? 'Saving...' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-1 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-gray-500">Loading users...</p>}
      {loadError && <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4">{loadError}</p>}

      {!loading && !loadError && (
        <table className="w-full bg-white rounded shadow text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Created</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              // Your own row cannot be changed or deleted (the backend also blocks it)
              const isMe = u._id === me?.id
              return (
                <tr key={u._id} className="border-t">
                  <td className="p-2">
                    {u.fullName} {isMe && <span className="text-gray-500">(you)</span>}
                  </td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">
                    {isMe ? (
                      u.role
                    ) : (
                      <select
                        className="border rounded px-2 py-1"
                        value={u.role}
                        onChange={(e) => changeRole(u, e.target.value as UserRole)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="p-2">{u.createdAt.slice(0, 10)}</td>
                  <td className="p-2">
                    {!isMe && (
                      <button onClick={() => handleDelete(u)} className="text-red-600 underline">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Users