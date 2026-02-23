import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://c4tickets-asistencia-tecnicaback.vercel.app/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token_caso4')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const loginApi        = (data)       => api.post('/auth/login', data)

export const getClientes     = ()           => api.get('/clientes')
export const crearCliente    = (data)       => api.post('/clientes', data)
export const editarCliente   = (id, data)   => api.put(`/clientes/${id}`, data)
export const borrarCliente   = (id)         => api.delete(`/clientes/${id}`)

export const getTecnicos     = ()           => api.get('/tecnicos')
export const crearTecnico    = (data)       => api.post('/tecnicos', data)
export const editarTecnico   = (id, data)   => api.put(`/tecnicos/${id}`, data)
export const borrarTecnico   = (id)         => api.delete(`/tecnicos/${id}`)

export const getTickets      = ()           => api.get('/tickets')
export const crearTicket     = (data)       => api.post('/tickets', data)
export const editarTicket    = (id, data)   => api.put(`/tickets/${id}`, data)
export const borrarTicket    = (id)         => api.delete(`/tickets/${id}`)

export default api
