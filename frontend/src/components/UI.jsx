import { Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PrivateRoute({ children }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return null
  return usuario ? children : <Navigate to="/" replace />
}

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/clientes',  label: 'Clientes',  icon: '🧑' },
  { to: '/tecnicos',  label: 'Técnicos',  icon: '🔧' },
  { to: '/tickets',   label: 'Tickets',   icon: '🎫' },
]

export function Layout({ children }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 flex-shrink-0 bg-zinc-800 border-r border-zinc-700/60 flex flex-col">
        <div className="p-6 border-b border-zinc-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-ticket-400 flex items-center justify-center text-lg shadow-lg shadow-amber-500/30">🎫</div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-none">TechDesk</p>
              <p className="text-zinc-400 text-xs mt-0.5">Gestión de Tickets</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? 'bg-amber-500/15 text-ticket-400 border border-amber-500/20' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50'
              }`
            }>
              <span className="text-base">{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-700/60">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-ticket-400/20 border border-amber-400/30 flex items-center justify-center text-ticket-400 text-xs font-bold">
              {usuario?.nombre?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-zinc-200 text-xs font-semibold truncate">{usuario?.nombre} {usuario?.apellido}</p>
              <p className="text-zinc-400 text-xs truncate">{usuario?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
            <span>↩</span> Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-zinc-950">{children}</main>
    </div>
  )
}

export function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card shadow-2xl fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-700/60">
          <h2 className="font-display font-bold text-white text-lg">{titulo}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function Alert({ tipo = 'error', mensaje, onClose }) {
  const estilos = { error: 'bg-red-500/10 border-red-500/30 text-red-400', success: 'bg-green-500/10 border-green-500/30 text-green-400', info: 'bg-blue-500/10 border-blue-500/30 text-blue-400' }
  const iconos  = { error: '✕', success: '✓', info: 'ℹ' }
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${estilos[tipo]} fade-in`}>
      <span className="font-bold">{iconos[tipo]}</span>
      <span className="flex-1">{mensaje}</span>
      {onClose && <button onClick={onClose} className="opacity-60 hover:opacity-100">&times;</button>}
    </div>
  )
}
