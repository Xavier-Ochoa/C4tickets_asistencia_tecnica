import { Schema, model } from 'mongoose'

const clienteSchema = new Schema({
  cedula:           { type: String, required: [true, 'La cédula es obligatoria'],   unique: true, trim: true },
  nombre:           { type: String, required: [true, 'El nombre es obligatorio'],   trim: true },
  apellido:         { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
  ciudad:           { type: String, required: [true, 'La ciudad es obligatoria'],   trim: true },
  email:            { type: String, required: [true, 'El email es obligatorio'],    unique: true, trim: true, lowercase: true },
  direccion:        { type: String, trim: true, default: null },
  telefono:         { type: String, required: [true, 'El teléfono es obligatorio'], trim: true },
  fecha_nacimiento: { type: Date, default: null },
  dependencia:      { type: String, trim: true, default: null }
}, { timestamps: true })

export default model('Cliente', clienteSchema)
