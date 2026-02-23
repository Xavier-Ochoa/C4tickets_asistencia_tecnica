import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

export const crearTokenJWT = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })

export const verificarTokenJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ msg: 'Token no proporcionado' })
  try {
    const { id } = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
    req.usuarioBDD = await Usuario.findById(id).select('-password -token -__v')
    if (!req.usuarioBDD) return res.status(401).json({ msg: 'Token inválido' })
    next()
  } catch {
    return res.status(401).json({ msg: 'Token inválido o expirado' })
  }
}
