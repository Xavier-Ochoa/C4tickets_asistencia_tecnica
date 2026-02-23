import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/UI'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Tecnicos from './pages/Tecnicos'
import Tickets from './pages/Tickets'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/clientes"  element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="/tecnicos"  element={<PrivateRoute><Tecnicos /></PrivateRoute>} />
        <Route path="/tickets"   element={<PrivateRoute><Tickets /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
