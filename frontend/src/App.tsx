import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PagePlaceholder from './pages/PagePlaceholder'
import Customers from './pages/Customers'
import Orders from './pages/Orders'

// All the routes of the system are listed here.
// A route connects a web address (like /orders) to a page.
// Every page sits inside <Layout>, so the sidebar shows on all of them.
// The placeholder pages will be replaced one by one as we build each feature.
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        {/* Orders is now a real page, not a placeholder */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/furniture" element={<PagePlaceholder title="Furniture" />} />
        <Route path="/materials" element={<PagePlaceholder title="Materials" />} />
        <Route path="/production" element={<PagePlaceholder title="Production" />} />
        <Route path="/payments" element={<PagePlaceholder title="Payments" />} />
        <Route path="/deliveries" element={<PagePlaceholder title="Deliveries" />} />
        <Route path="/reports" element={<PagePlaceholder title="Reports" />} />
      </Route>
    </Routes>
  )
}

export default App