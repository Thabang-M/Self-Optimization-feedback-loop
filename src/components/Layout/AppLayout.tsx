import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/', label: 'Daily' },
  { to: '/weekly', label: 'Weekly' },
  { to: '/monthly', label: 'Monthly' },
  { to: '/guide', label: 'Guide' },
]

export default function AppLayout() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white">Life Tracker</h1>
          <button
            onClick={signOut}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
        <nav className="max-w-2xl mx-auto px-4 pb-2 flex gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
