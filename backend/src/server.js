import express from 'express'
import cors from 'cors'
import session from 'express-session'
import dotenv from 'dotenv'
import authRoutes    from './routes/auth_routes.js'
import clienteRoutes from './routes/cliente_routes.js'
import tecnicoRoutes from './routes/tecnico_routes.js'
import ticketRoutes  from './routes/ticket_routes.js'

dotenv.config()
const app = express()

app.use(express.json())

// CORS dinámico: acepta localhost en dev y la URL de Vercel en producción
const allowedOrigins = [
  'http://localhost:5173',  
  'https://c4ticketsasistenciatecnicafront.vercel.app',
  'https://c4-tickets.vercel.app',   
  process.env.URL_FRONTEND,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true) // Postman / curl
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error(`CORS bloqueado para: ${origin}`))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto_tickets_asistencia',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}))

app.get('/', (_, res) => res.send('🎫 API – Sistema de Gestión de Tickets de Asistencia Técnica'))
app.use('/api/auth',     authRoutes)
app.use('/api/clientes', clienteRoutes)
app.use('/api/tecnicos', tecnicoRoutes)
app.use('/api/tickets',  ticketRoutes)

app.use((req, res) => res.status(404).json({ msg: 'Endpoint no encontrado' }))
app.use((err, req, res, next) => res.status(500).json({ msg: 'Error interno del servidor' }))

export default app
