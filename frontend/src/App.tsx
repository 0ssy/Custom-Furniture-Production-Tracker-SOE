import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PagePlaceholder from './pages/PagePlaceholder'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Furniture from './pages/Furniture'
import Materials from './pages/Materials'
import Production from './pages/Production'
import Payments from './pages/Payments'
import Deliveries from './pages/Deliveries'

// All the routes of the system.
// /login is open to everyone.
// Everything inside ProtectedRoute needs a login, and sits inside Layout
// so the sidebar shows on all of those pages.
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/furniture" element={<Furniture />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/production" element={<Production />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/reports" element={<PagePlaceholder title="Reports" />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App