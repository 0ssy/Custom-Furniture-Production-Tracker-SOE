import { useSystemData } from '../services/useSystemData'
import { showMoney } from '../utils/money'
import { sumPayments } from '../utils/paymentMath'

// One summary card. Small helper so we do not repeat the same markup 8 times.
function Card({ label, value, red = false }: { label: string; value: string | number; red?: boolean }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500">{label}</p>
      <p className={`text-3xl font-bold ${red ? 'text-red-600' : ''}`}>{value}</p>
    </div>
  )
}

function Dashboard() {
  // All the numbers come from the real database
  const { orders, customers, payments, deliveries, materials, loading, error } =
    useSystemData()

  if (loading) return <p className="text-gray-500">Loading dashboard...</p>
  if (error) {
    return <p className="bg-red-100 text-red-700 px-3 py-2 rounded">{error}</p>
  }

  // Cancelled orders are left out of the money numbers
  const activeOrders = orders.filter((o) => o.orderStatus !== 'Cancelled')
  const billed = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  const received = activeOrders.reduce(
    (sum, o) => sum + sumPayments(payments, o._id, 'Completed'),
    0
  )

  // The five newest orders. [...orders] makes a copy so the real list is not changed.
  const recent = [...orders]
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
    .slice(0, 5)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Two rows of four summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card label="Customers" value={customers.length} />
        <Card label="Total Orders" value={orders.length} />
        <Card
          label="Pending Orders"
          value={orders.filter((o) => o.orderStatus === 'Pending').length}
        />
        <Card
          label="In Production"
          value={orders.filter((o) => o.orderStatus === 'In Production').length}
        />
        <Card
          label="Pending Deliveries"
          value={
            deliveries.filter(
              (d) => d.deliveryStatus === 'Pending' || d.deliveryStatus === 'In Transit'
            ).length
          }
        />
        <Card label="Received (KES)" value={showMoney(received)} />
        <Card label="Outstanding (KES)" value={showMoney(billed - received)} red />
        <Card
          label="Low Stock Materials"
          value={materials.filter((m) => m.quantityInStock <= m.reorderLevel).length}
          red
        />
      </div>

      {/* Recent orders */}
      <h3 className="text-lg font-bold mb-2">Recent Orders</h3>
      <table className="w-full bg-white rounded shadow text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Customer</th>
            <th className="p-2">Total (KES)</th>
            <th className="p-2">Status</th>
            <th className="p-2">Order Date</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((o) => (
            <tr key={o._id} className="border-t">
              <td className="p-2">{o.customer?.fullName ?? 'Unknown customer'}</td>
              <td className="p-2">{showMoney(o.totalAmount)}</td>
              <td className="p-2">{o.orderStatus}</td>
              <td className="p-2">{o.orderDate.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {recent.length === 0 && <p className="text-gray-500 mt-3">No orders yet.</p>}
    </div>
  )
}

export default Dashboard