import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PagePlaceholder from './pages/PagePlaceholder'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Furniture from './pages/Furniture'
import Materials from './pages/Materials'
import Production from './pages/Production'
import Payments from './pages/Payments'

// All the routes of the system are listed here.
// A route connects a web address (like /payments) to a page.
// Every page sits inside <Layout>, so the sidebar shows on all of them.
// The placeholder pages will be replaced one by one as we build each feature.
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/furniture" element={<Furniture />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/production" element={<Production />} />
        {/* Payments is now a real page, not a placeholder */}
        <Route path="/payments" element={<Payments />} />
        <Route path="/deliveries" element={<PagePlaceholder title="Deliveries" />} />
        <Route path="/reports" element={<PagePlaceholder title="Reports" />} />
      </Route>
    </Routes>
  )
}

export default App