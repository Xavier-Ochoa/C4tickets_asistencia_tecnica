import { Schema, model } from 'mongoose'

const ticketSchema = new Schema({
  codigo:      { type: String, required: [true, 'El código es obligatorio'], unique: true, trim: true },
  descripcion: { type: String, trim: true, default: null },
  tecnico:     { type: Schema.Types.ObjectId, ref: 'Tecnico', required: [true, 'El técnico es obligatorio'] },
  cliente:     { type: Schema.Types.ObjectId, ref: 'Cliente', required: [true, 'El cliente es obligatorio'] }
}, { timestamps: true })

export default model('Ticket', ticketSchema)
