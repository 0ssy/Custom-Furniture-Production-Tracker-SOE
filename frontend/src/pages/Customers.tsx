import { useState } from 'react'
import type { Customer } from '../types/customer'
import { mockCustomers } from '../data/mockCustomers'
import CustomerForm from '../components/CustomerForm'

function Customers() {
  // The list of customers. It starts with the fake data.
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)

  // Text typed in the search box
  const [search, setSearch] = useState('')

  // Is the form open or closed?
  const [showForm, setShowForm] = useState(false)

  // Which customer are we editing? null means we are adding a new one.
  const [editing, setEditing] = useState<Customer | null>(null)

  // Search by name or phone. toLowerCase makes it ignore capital letters.
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  )

  // Open the empty form to add a customer
  function handleAddClick() {
    setEditing(null)
    setShowForm(true)
  }

  // Open the form filled with the chosen customer's details
  function handleEditClick(customer: Customer) {
    setEditing(customer)
    setShowForm(true)
  }

  // Called by the form when the data is valid
  function handleSave(data: Omit<Customer, '_id' | 'createdAt'>) {
    if (editing) {
      // EDIT: go through the list and replace only the customer we edited
      setCustomers(
        customers.map((c) => (c._id === editing._id ? { ...c, ...data } : c))
      )
    } else {
      // ADD: make a new customer.
      // crypto.randomUUID() gives a unique fake id every time, so two
      // customers can never share an id. The real backend will make the _id later.
      const newCustomer: Customer = {
        _id: crypto.randomUUID(),
        ...data,
        // toLocaleDateString('en-CA') gives today's date as YYYY-MM-DD
        // using the computer's own timezone, so Kenya time is correct
        createdAt: new Date().toLocaleDateString('en-CA'),
      }
      setCustomers([...customers, newCustomer])
    }
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customers</h2>
        <button
          onClick={handleAddClick}
          className="bg-amber-600 text-white px-4 py-2 rounded"
        >
          + Add Customer
        </button>
      </div>

      {/* The form only shows when showForm is true.
          The key makes React reset the form when we switch between customers. */}
      {showForm && (
        <CustomerForm
          key={editing?._id ?? 'new'}
          customer={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
          }}
        />
      )}

      {/* Search box */}
      <input
        className="border rounded px-3 py-2 mb-4 w-full max-w-sm bg-white"
        placeholder="Search by name or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Customers table */}
      <table className="w-full bg-white rounded shadow text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Email</th>
            <th className="p-2">Address</th>
            <th className="p-2">Registered</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.phone}</td>
              <td className="p-2">{c.email || '-'}</td>
              <td className="p-2">{c.address || '-'}</td>
              <td className="p-2">{c.createdAt}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEditClick(c)}
                  className="text-amber-700 underline"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Message when the search finds nothing */}
      {filtered.length === 0 && (
        <p className="text-gray-500 mt-3">No customers found.</p>
      )}
    </div>
  )
}

export default Customers