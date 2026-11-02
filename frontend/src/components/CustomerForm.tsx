import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Customer } from '../types/customer'

// Props = things the parent page gives to this form.
// customer: if it exists we are EDITING, if not we are ADDING.
// onSave: function to run when the form is valid and submitted.
// onCancel: function to run when the user closes the form.
type Props = {
  customer: Customer | null
  onSave: (data: Omit<Customer, '_id' | 'createdAt'>) => void
  onCancel: () => void
}

function CustomerForm({ customer, onSave, onCancel }: Props) {
  // Each input has its own state. When editing, we start with the
  // customer's current values. When adding, we start empty.
  const [name, setName] = useState(customer?.name ?? '')
  const [phone, setPhone] = useState(customer?.phone ?? '')
  const [email, setEmail] = useState(customer?.email ?? '')
  const [address, setAddress] = useState(customer?.address ?? '')

  // Holds validation error messages to show under the inputs
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({})

  // Checks the inputs and returns true if everything is fine
  function validate() {
    const newErrors: { name?: string; phone?: string; email?: string } = {}

    if (name.trim() === '') {
      newErrors.name = 'Name is required'
    }
    // Phone must be digits only, 10 numbers long (e.g. 0712345678)
    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Phone must be 10 digits'
    }
    // Email is optional. If they type one, it must be: text, ONE @, text, a dot, text.
    // [^\s@] means "any character except a space or @", so a second @ is rejected.
    // We also reject two dots in a row like a@b..com
    if (
      email !== '' &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.includes('..'))
    ) {
      newErrors.email = 'Email is not valid'
    }

    setErrors(newErrors)
    // If newErrors has no keys, there are no problems
    return Object.keys(newErrors).length === 0
  }

  // Runs when the user clicks Save
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stops the browser from reloading the page
    if (!validate()) return // stop here if something is wrong
    onSave({ name: name.trim(), phone, email, address })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold mb-3">
        {customer ? 'Edit Customer' : 'Add Customer'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Name *</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
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
          <label className="block text-sm mb-1">Email</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Address</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button type="submit" className="bg-amber-600 text-white px-4 py-1 rounded">
          Save
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