import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import AuthPage from './components/Auth/AuthPage'
import AppLayout from './components/Layout/AppLayout'
import DailyLogForm from './components/DailyLog/DailyLogForm'
import WeeklyReview from './components/WeeklyReview/WeeklyReview'
import MonthlyOverview from './components/MonthlyOverview/MonthlyOverview'
import ScoringGuide from './components/ScoringGuide/ScoringGuide'
import type { ReactNode } from 'react'

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
  return (
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
  )
}
