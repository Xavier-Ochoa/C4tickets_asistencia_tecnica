import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginApi } from '../services/api'
import { Alert } from '../components/UI'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!form.email || !form.password) { setError('Debes completar todos los campos.'); return }
    setLoading(true)
    try { const { data } = await loginApi(form); login(data); navigate('/dashboard') }
    catch { setError('Usuario o contraseña incorrectos.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-600/4 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ticket-400 shadow-2xl shadow-amber-500/40 mb-5 text-3xl">🎫</div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">TechDesk</h1>
          <p className="text-zinc-400 text-sm">Sistema de Gestión de Tickets de Asistencia Técnica</p>
        </div>
        <div className="card p-8 shadow-2xl">
          <h2 className="font-display font-semibold text-white text-lg mb-6">Iniciar sesión</h2>
          {error && <div className="mb-5"><Alert tipo="error" mensaje={error} onClose={() => setError('')} /></div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <input type="email" placeholder="correo@ejemplo.com" className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Clave</label>
              <input type="password" placeholder="••••••••" className="input-field" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
