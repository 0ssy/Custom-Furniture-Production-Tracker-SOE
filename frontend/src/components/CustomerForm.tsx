import { useState } from 'react'
import type { FormEvent } from 'react'
import type { ApiCustomer } from '../types/customer'

// Props are the things the parent page (Customers.tsx) gives to this form.
// customer: if it has a customer we are EDITING, if null we are ADDING.
// saving:   true while the backend is busy, so Save cannot be clicked twice.
// onSave:   runs when the form is valid.
// onCancel: runs when Cancel is clicked.
type Props = {
  customer: ApiCustomer | null
  saving: boolean
  onSave: (data: Omit<ApiCustomer, '_id' | 'createdAt'>) => void
  onCancel: () => void
}

// Shape of the error messages. "?" means each one is optional.
type FormErrors = {
  fullName?: string
  phone?: string
  email?: string
  address?: string
}

function CustomerForm({ customer, saving, onSave, onCancel }: Props) {
  // One state for each input. When editing we start with the current values.
  const [fullName, setFullName] = useState(customer?.fullName ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [email, setEmail] = useState(customer?.email ?? '')
  const [address, setAddress] = useState(customer?.address ?? '')

  // Error messages shown under the inputs. Starts empty.
  const [errors, setErrors] = useState<FormErrors>({})

  // Checks every input. Returns true if all is fine.
  function validate() {
    const newErrors: FormErrors = {}

    // Jose's backend needs at least 2 characters
    if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }
    // Backend needs 7+, we ask for exactly 10 digits (like 0712345678)
    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone must be 10 digits'
    }
    // Email is REQUIRED in the backend: one @, text, a dot, text, no ".."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.includes('..')) {
      newErrors.email = 'A valid email is required'
    }
    // Address is REQUIRED in the backend, at least 3 characters
    if (address.trim().length < 3) {
      newErrors.address = 'Address must be at least 3 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Runs when the user clicks Save
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return // something is wrong, so do not save

    onSave({
      fullName: fullName.trim(),
      phone,
      email: email.trim(),
      address: address.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-3">
        {customer ? 'Edit Customer' : 'Add Customer'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Full Name *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Phone *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Email *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Address *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-amber-600 text-white px-4 py-1 rounded disabled:bg-gray-300"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CustomerForm