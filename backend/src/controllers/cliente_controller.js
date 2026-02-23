import Cliente from '../models/Cliente.js'

export const listarClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().select('-__v')
    res.status(200).json({ msg: 'Clientes listados correctamente', total: clientes.length, clientes })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const detalleCliente = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const cliente = await Cliente.findById(id).select('-__v')
    if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' })
    res.status(200).json({ msg: 'Cliente encontrado', cliente })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const crearCliente = async (req, res) => {
  try {
    const faltantes = ['cedula','nombre','apellido','ciudad','email','telefono'].filter(c => !req.body[c])
    if (faltantes.length) return res.status(400).json({ msg: `Faltan campos obligatorios: ${faltantes.join(', ')}` })
    if (await Cliente.findOne({ cedula: req.body.cedula })) return res.status(400).json({ msg: 'Ya existe un cliente con esta cédula' })
    if (await Cliente.findOne({ email: req.body.email?.toLowerCase() })) return res.status(400).json({ msg: 'Ya existe un cliente con este email' })
    const cliente = await new Cliente(req.body).save()
    res.status(201).json({ msg: 'Cliente creado correctamente', cliente })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(e => e.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body || {}
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    if (!Object.keys(data).length) return res.status(400).json({ msg: 'Debes enviar al menos un campo' })
    if (data.cedula) {
      const existe = await Cliente.findOne({ cedula: data.cedula, _id: { $ne: id } })
      if (existe) return res.status(400).json({ msg: 'Ya existe otro cliente con esta cédula' })
    }
    if (data.email) {
      const existe = await Cliente.findOne({ email: data.email.toLowerCase(), _id: { $ne: id } })
      if (existe) return res.status(400).json({ msg: 'Ya existe otro cliente con este email' })
    }
    const cliente = await Cliente.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-__v')
    if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' })
    res.status(200).json({ msg: 'Cliente actualizado correctamente', cliente })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(e => e.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const cliente = await Cliente.findByIdAndDelete(id)
    if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' })
    res.status(200).json({ msg: 'Cliente eliminado correctamente', cliente })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}
