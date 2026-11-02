import { NavLink, Outlet } from 'react-router-dom'

// The menu items. Keeping them in an array means we don't repeat code
// and adding a new page later is just one new line.
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
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left sidebar with the navigation links */}
      <aside className="w-60 bg-gray-900 text-white p-4">
        <h1 className="text-lg font-bold mb-6">Furniture Tracker</h1>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'} // so Dashboard is only active on "/" exactly
              // NavLink tells us if the link is the current page (isActive)
              // so we can highlight it
              className={({ isActive }) =>
                `px-3 py-2 rounded ${
                  isActive ? 'bg-amber-600' : 'hover:bg-gray-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Right side: Outlet is where the current page gets displayed */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout