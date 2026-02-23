import { createContext, useContext, useState, useEffect } from 'react'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario]   = useState(null)
  const [token, setToken]       = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('token_caso4')
    const u = localStorage.getItem('usuario_caso4')
    if (t && u) { setToken(t); setUsuario(JSON.parse(u)) }
    setCargando(false)
  }, [])

  const login = (data) => {
    const u = { nombre: data.nombre, apellido: data.apellido, email: data.email, _id: data._id }
    setToken(data.token); setUsuario(u)
    localStorage.setItem('token_caso4', data.token)
    localStorage.setItem('usuario_caso4', JSON.stringify(u))
  }

  const logout = () => {
    setToken(null); setUsuario(null)
    localStorage.removeItem('token_caso4')
    localStorage.removeItem('usuario_caso4')
  }

  return <AuthContext.Provider value={{ usuario, token, login, logout, cargando }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
