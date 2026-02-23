import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from './server.js'

dotenv.config()

// Conexión con caché para Vercel Serverless (reutiliza la conexión entre invocaciones)
let isConnected = false

const conectarDB = async () => {
  if (isConnected) return
  await mongoose.connect(process.env.MONGODB_URI)
  isConnected = true
  console.log('✅ Conexión a MongoDB exitosa — Base de datos: caso4')
}

// En local levanta el servidor normal
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000
  conectarDB()
    .then(() => app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)))
    .catch(err => { console.error('❌ Error:', err.message); process.exit(1) })
}

// Para Vercel: conecta la BD antes de cada request y exporta la app
export default async (req, res) => {
  await conectarDB()
  app(req, res)
}
