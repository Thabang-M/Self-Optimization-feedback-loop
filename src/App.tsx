import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Component, type ReactNode } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { supabaseMissing } from './lib/supabase'
import AuthPage from './components/Auth/AuthPage'
import AppLayout from './components/Layout/AppLayout'
import DailyLogForm from './components/DailyLog/DailyLogForm'
import WeeklyReview from './components/WeeklyReview/WeeklyReview'
import MonthlyOverview from './components/MonthlyOverview/MonthlyOverview'
import ScoringGuide from './components/ScoringGuide/ScoringGuide'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state: { error: string | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error: error.message }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-6 max-w-md text-center">
            <h1 className="text-lg font-bold text-red-300 mb-2">Something went wrong</h1>
            <p className="text-sm text-red-400">{this.state.error}</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  }
  return user ? <Navigate to="/" replace /> : <>{children}</>
}

export default function App() {
  if (supabaseMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-yellow-900/30 border border-yellow-800 rounded-xl p-6 max-w-md text-center">
          <h1 className="text-lg font-bold text-yellow-300 mb-2">Configuration Missing</h1>
          <p className="text-sm text-yellow-400">
            VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set as environment variables.
            Add them in your Vercel project settings and redeploy.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<DailyLogForm />} />
              <Route path="weekly" element={<WeeklyReview />} />
              <Route path="monthly" element={<MonthlyOverview />} />
              <Route path="guide" element={<ScoringGuide />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
