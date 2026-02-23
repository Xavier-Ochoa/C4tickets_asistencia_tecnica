import { Schema, model } from 'mongoose'

const tecnicoSchema = new Schema({
  nombre:           { type: String, required: [true, 'El nombre es obligatorio'],   trim: true },
  apellido:         { type: String, required: [true, 'El apellido es obligatorio'], trim: true },
  cedula:           { type: String, required: [true, 'La cédula es obligatoria'],   unique: true, trim: true },
  fecha_nacimiento: { type: Date, default: null },
  genero:           { type: String, enum: ['masculino', 'femenino', 'otro'], required: [true, 'El género es obligatorio'] },
  direccion:        { type: String, trim: true, default: null },
  telefono:         { type: String, required: [true, 'El teléfono es obligatorio'], trim: true },
  email:            { type: String, required: [true, 'El email es obligatorio'],    unique: true, trim: true, lowercase: true }
}, { timestamps: true })

export default model('Tecnico', tecnicoSchema)
