import Usuario from '../models/Usuario.js'
import { crearTokenJWT } from '../middlewares/JWT.js'

export const registro = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body
    const faltantes = ['nombre','apellido','email','password'].filter(c => !req.body[c])
    if (faltantes.length) return res.status(400).json({ msg: `Faltan campos: ${faltantes.join(', ')}` })
    if (await Usuario.findOne({ email })) return res.status(400).json({ msg: 'El email ya está registrado' })
    const u = new Usuario(req.body)
    u.password = await u.encryptPassword(password)
    u.token    = u.createToken()
    await u.save()
    res.status(201).json({ msg: 'Usuario registrado correctamente', usuario: { _id: u._id, nombre: u.nombre, apellido: u.apellido, email: u.email } })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ msg: 'Debes llenar todos los campos' })
    const u = await Usuario.findOne({ email })
    if (!u) return res.status(404).json({ msg: 'El usuario no se encuentra registrado' })
    if (!await u.matchPassword(password)) return res.status(401).json({ msg: 'Lo sentimos, el password no es el correcto' })
    const token = crearTokenJWT(u._id)
    res.status(200).json({ token, nombre: u.nombre, apellido: u.apellido, _id: u._id, email: u.email })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const perfil = (req, res) => res.status(200).json({ msg: 'Perfil del usuario', usuario: req.usuarioBDD })
