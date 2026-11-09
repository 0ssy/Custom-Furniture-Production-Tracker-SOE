import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// The menu items. Keeping them in an array means we don't repeat code.
const menuItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Customers', path: '/customers' },
  { label: 'Orders', path: '/orders' },
  { label: 'Furniture', path: '/furniture' },
  { label: 'Materials', path: '/materials' },
  { label: 'Production', path: '/production' },
  { label: 'Payments', path: '/payments' },
  { label: 'Deliveries', path: '/deliveries' },
  { label: 'Reports', path: '/reports' },
]

function Layout() {
  // Who is logged in, and the function that logs them out
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Log out, then go to the login page
  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left sidebar. flex-col lets us push the user box to the bottom */}
        <aside className="w-60 bg-gray-900 text-white p-4 flex flex-col print:hidden">
        <h1 className="text-lg font-bold mb-6">Furniture Tracker</h1>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'} // so Dashboard is only active on "/" exactly
              className={({ isActive }) =>
                `px-3 py-2 rounded ${isActive ? 'bg-amber-600' : 'hover:bg-gray-700'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* mt-auto pushes this box to the bottom of the sidebar */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <p className="font-bold">{user?.fullName}</p>
          <p className="text-sm text-gray-400">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="mt-2 bg-gray-700 px-3 py-1 rounded w-full"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Right side: Outlet is where the current page gets displayed */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout