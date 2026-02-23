import Ticket from '../models/Ticket.js'
import Cliente from '../models/Cliente.js'
import Tecnico from '../models/Tecnico.js'

const populate = q => q.populate('tecnico', '-__v').populate('cliente', '-__v').select('-__v')

export const listarTickets = async (req, res) => {
  try {
    const tickets = await populate(Ticket.find())
    res.status(200).json({ msg: 'Tickets listados correctamente', total: tickets.length, tickets })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const detalleTicket = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const ticket = await populate(Ticket.findById(id))
    if (!ticket) return res.status(404).json({ msg: 'Ticket no encontrado' })
    res.status(200).json({ msg: 'Ticket encontrado', ticket })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const crearTicket = async (req, res) => {
  try {
    const { codigo, descripcion, tecnico, cliente } = req.body
    const faltantes = ['codigo','tecnico','cliente'].filter(c => !req.body[c])
    if (faltantes.length) return res.status(400).json({ msg: `Faltan campos obligatorios: ${faltantes.join(', ')}` })

    if (await Ticket.findOne({ codigo: codigo.trim() })) return res.status(400).json({ msg: 'Ya existe un ticket con este código' })

    if (!tecnico.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID de técnico inválido' })
    if (!await Tecnico.findById(tecnico)) return res.status(404).json({ msg: 'El técnico indicado no existe' })

    if (!cliente.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID de cliente inválido' })
    if (!await Cliente.findById(cliente)) return res.status(404).json({ msg: 'El cliente indicado no existe' })

    const nuevo = await new Ticket({ codigo: codigo.trim(), descripcion: descripcion || null, tecnico, cliente }).save()
    const ticket = await populate(Ticket.findById(nuevo._id))
    res.status(201).json({ msg: 'Ticket creado correctamente', ticket })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(e => e.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const actualizarTicket = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body || {}
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    if (!Object.keys(data).length) return res.status(400).json({ msg: 'Debes enviar al menos un campo' })

    if (data.codigo) {
      const existe = await Ticket.findOne({ codigo: data.codigo.trim(), _id: { $ne: id } })
      if (existe) return res.status(400).json({ msg: 'Ya existe otro ticket con este código' })
      data.codigo = data.codigo.trim()
    }
    if (data.tecnico) {
      if (!data.tecnico.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID de técnico inválido' })
      if (!await Tecnico.findById(data.tecnico)) return res.status(404).json({ msg: 'El técnico indicado no existe' })
    }
    if (data.cliente) {
      if (!data.cliente.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID de cliente inválido' })
      if (!await Cliente.findById(data.cliente)) return res.status(404).json({ msg: 'El cliente indicado no existe' })
    }

    const ticket = await populate(Ticket.findByIdAndUpdate(id, data, { new: true, runValidators: true }))
    if (!ticket) return res.status(404).json({ msg: 'Ticket no encontrado' })
    res.status(200).json({ msg: 'Ticket actualizado correctamente', ticket })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(e => e.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const eliminarTicket = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const ticket = await populate(Ticket.findByIdAndDelete(id))
    if (!ticket) return res.status(404).json({ msg: 'Ticket no encontrado' })
    res.status(200).json({ msg: 'Ticket eliminado correctamente', ticket })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}
