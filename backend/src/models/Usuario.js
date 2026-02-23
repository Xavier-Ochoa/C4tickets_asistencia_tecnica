import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new Schema({
  nombre:   { type: String, required: [true, 'El nombre es obligatorio'],   trim: true },
  apellido: { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
  email:    { type: String, required: [true, 'El email es obligatorio'],    unique: true, trim: true, lowercase: true },
  password: { type: String, required: [true, 'La contraseña es obligatoria'] },
  token:    { type: String }
}, { timestamps: true })

usuarioSchema.methods.encryptPassword = async function (password) {
  return await bcrypt.hash(password, 10)
}
usuarioSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}
usuarioSchema.methods.createToken = function () {
  return Math.random().toString(36).slice(2)
}

export default model('Usuario', usuarioSchema)
