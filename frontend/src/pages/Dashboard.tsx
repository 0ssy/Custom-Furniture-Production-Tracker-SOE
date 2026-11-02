// Simple dashboard for now. The numbers are hardcoded.
// Later they will come from the backend.
function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Three summary cards in a row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">In Production</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Pending Deliveries</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard