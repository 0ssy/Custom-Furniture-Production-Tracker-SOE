import { Link } from 'react-router-dom'

// Shown when the address does not match any page, like /xyz
function NotFound() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Page not found</h2>
      <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
      <Link to="/" className="text-amber-700 underline">
        Go back to the Dashboard
      </Link>
    </div>
  )
}

export default NotFound