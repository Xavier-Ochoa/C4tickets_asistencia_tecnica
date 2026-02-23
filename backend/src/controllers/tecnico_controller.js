import Tecnico from '../models/Tecnico.js'

export const listarTecnicos = async (req, res) => {
  try {
    const tecnicos = await Tecnico.find().select('-__v')
    res.status(200).json({ msg: 'Técnicos listados correctamente', total: tecnicos.length, tecnicos })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const detalleTecnico = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const tecnico = await Tecnico.findById(id).select('-__v')
    if (!tecnico) return res.status(404).json({ msg: 'Técnico no encontrado' })
    res.status(200).json({ msg: 'Técnico encontrado', tecnico })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}

export const crearTecnico = async (req, res) => {
  try {
    const faltantes = ['nombre','apellido','cedula','genero','telefono','email'].filter(c => !req.body[c])
    if (faltantes.length) return res.status(400).json({ msg: `Faltan campos obligatorios: ${faltantes.join(', ')}` })
    if (await Tecnico.findOne({ cedula: req.body.cedula })) return res.status(400).json({ msg: 'Ya existe un técnico con esta cédula' })
    if (await Tecnico.findOne({ email: req.body.email?.toLowerCase() })) return res.status(400).json({ msg: 'Ya existe un técnico con este email' })
    const tecnico = await new Tecnico(req.body).save()
    res.status(201).json({ msg: 'Técnico creado correctamente', tecnico })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(e => e.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const actualizarTecnico = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body || {}
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    if (!Object.keys(data).length) return res.status(400).json({ msg: 'Debes enviar al menos un campo' })
    if (data.cedula) {
      const existe = await Tecnico.findOne({ cedula: data.cedula, _id: { $ne: id } })
      if (existe) return res.status(400).json({ msg: 'Ya existe otro técnico con esta cédula' })
    }
    if (data.email) {
      const existe = await Tecnico.findOne({ email: data.email.toLowerCase(), _id: { $ne: id } })
      if (existe) return res.status(400).json({ msg: 'Ya existe otro técnico con este email' })
    }
    const tecnico = await Tecnico.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-__v')
    if (!tecnico) return res.status(404).json({ msg: 'Técnico no encontrado' })
    res.status(200).json({ msg: 'Técnico actualizado correctamente', tecnico })
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ msg: 'Error de validación', errores: Object.values(e.errors).map(e => e.message) })
    if (e.code === 11000) return res.status(400).json({ msg: `Ya existe un registro con este ${Object.keys(e.keyPattern)[0]}` })
    res.status(500).json({ msg: `Error en el servidor: ${e.message}` })
  }
}

export const eliminarTecnico = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ msg: 'ID inválido' })
    const tecnico = await Tecnico.findByIdAndDelete(id)
    if (!tecnico) return res.status(404).json({ msg: 'Técnico no encontrado' })
    res.status(200).json({ msg: 'Técnico eliminado correctamente', tecnico })
  } catch (e) { res.status(500).json({ msg: `Error en el servidor: ${e.message}` }) }
}
