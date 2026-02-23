import { useState, useEffect } from 'react'
import { Layout, Modal, Alert } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { getTickets, getClientes, getTecnicos, crearTicket, editarTicket, borrarTicket } from '../services/api'

const VACIO = { codigo: '', descripcion: '', tecnico: '', cliente: '' }

export default function Tickets() {
  const { usuario } = useAuth()
  const [tickets, setTickets]         = useState([])
  const [clientes, setClientes]       = useState([])
  const [tecnicos, setTecnicos]       = useState([])
  const [cargando, setCargando]       = useState(true)
  const [modal, setModal]             = useState(null)
  const [sel, setSel]                 = useState(null)
  const [form, setForm]               = useState(VACIO)
  const [alerta, setAlerta]           = useState(null)
  const [guardando, setGuardando]     = useState(false)
  const [busqueda, setBusqueda]       = useState('')
  const [vistaAgrupada, setVistaAgrupada] = useState(false)

  const cargar = async () => {
    try {
      const [tRes, cRes, tecRes] = await Promise.all([getTickets(), getClientes(), getTecnicos()])
      setTickets(tRes.data.tickets || [])
      setClientes(cRes.data.clientes || [])
      setTecnicos(tecRes.data.tecnicos || [])
    } catch { setAlerta({ tipo: 'error', msg: 'Error al cargar datos' }) }
    finally { setCargando(false) }
  }
  useEffect(() => { cargar() }, [])

  const abrirCrear  = () => { setForm(VACIO); setModal('crear') }
  const abrirEditar = (t) => {
    setSel(t); setModal('editar')
    setForm({ codigo: t.codigo, descripcion: t.descripcion || '', tecnico: t.tecnico?._id || t.tecnico, cliente: t.cliente?._id || t.cliente })
  }
  const abrirEliminar = (t) => { setSel(t); setModal('eliminar') }
  const cerrar = () => { setModal(null); setSel(null) }

  const handleGuardar = async (e) => {
    e.preventDefault(); setGuardando(true)
    try {
      if (modal === 'crear') await crearTicket(form)
      else await editarTicket(sel._id, form)
      setAlerta({ tipo: 'success', msg: modal === 'crear' ? 'Ticket creado correctamente' : 'Ticket actualizado correctamente' })
      cerrar(); cargar()
    } catch (err) { setAlerta({ tipo: 'error', msg: err.response?.data?.msg || 'Error al guardar' }) }
    finally { setGuardando(false) }
  }

  const handleEliminar = async () => {
    setGuardando(true)
    try { await borrarTicket(sel._id); setAlerta({ tipo: 'success', msg: 'Ticket eliminado correctamente' }); cerrar(); cargar() }
    catch { setAlerta({ tipo: 'error', msg: 'Error al eliminar ticket' }) }
    finally { setGuardando(false) }
  }

  const filtrados = tickets.filter(t => {
    const c = `${t.cliente?.nombre || ''} ${t.cliente?.apellido || ''}`
    const tec = `${t.tecnico?.nombre || ''} ${t.tecnico?.apellido || ''}`
    return `${t.codigo} ${c} ${tec}`.toLowerCase().includes(busqueda.toLowerCase())
  })

  // Agrupar por cliente
  const agrupados = filtrados.reduce((acc, t) => {
    const key    = t.cliente?._id || 'sin'
    const nombre = t.cliente ? `${t.cliente.nombre} ${t.cliente.apellido}` : 'Sin cliente'
    if (!acc[key]) acc[key] = { nombre, cedula: t.cliente?.cedula, tickets: [] }
    acc[key].tickets.push(t)
    return acc
  }, {})

  return (
    <Layout>
      <div className="p-8 fade-in">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-zinc-400 text-sm mb-1">Bienvenido — <span className="text-ticket-400">{usuario?.nombre} {usuario?.apellido}</span></p>
            <h1 className="font-display font-bold text-3xl text-white">Tickets</h1>
            <p className="text-zinc-400 text-sm mt-1">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} registrado{tickets.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={abrirCrear} className="btn-primary flex items-center gap-2"><span className="text-lg leading-none">+</span> Nuevo ticket</button>
        </div>

        {alerta && <div className="mb-6"><Alert tipo={alerta.tipo} mensaje={alerta.msg} onClose={() => setAlerta(null)} /></div>}

        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <input type="text" placeholder="Buscar por código, cliente o técnico..." className="input-field max-w-sm" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700/60 rounded-xl p-1">
            <button onClick={() => setVistaAgrupada(false)} className={`text-xs px-3 py-1.5 rounded-lg transition-all ${!vistaAgrupada ? 'bg-ticket-400 text-white' : 'text-zinc-400 hover:text-white'}`}>Lista</button>
            <button onClick={() => setVistaAgrupada(true)}  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${vistaAgrupada  ? 'bg-ticket-400 text-white' : 'text-zinc-400 hover:text-white'}`}>Por cliente</button>
          </div>
        </div>

        {cargando ? (
          <div className="card p-12 text-center text-zinc-400">Cargando...</div>
        ) : filtrados.length === 0 ? (
          <div className="card p-12 text-center text-zinc-400">No hay tickets registrados</div>
        ) : vistaAgrupada ? (
          <div className="space-y-6">
            {Object.values(agrupados).map(({ nombre, cedula, tickets: ts }) => (
              <div key={nombre} className="card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 bg-zinc-700/30 border-b border-zinc-700/60">
                  <div className="w-8 h-8 rounded-full bg-ticket-400/20 border border-amber-400/30 flex items-center justify-center text-ticket-400 text-xs font-bold">{nombre[0]}</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{nombre}</p>
                    {cedula && <p className="text-zinc-400 text-xs">Cédula: {cedula}</p>}
                  </div>
                  <span className="ml-auto text-xs bg-ticket-400/15 text-ticket-400 px-2.5 py-1 rounded-full font-medium">{ts.length} ticket{ts.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-zinc-700/40">
                      <tr>{['Código','Técnico','Descripción','Acciones'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {ts.map(t => (
                        <tr key={t._id} className="table-row">
                          <td className="table-cell font-mono text-ticket-400 text-xs font-semibold">{t.codigo}</td>
                          <td className="table-cell text-white">{t.tecnico?.nombre} {t.tecnico?.apellido}</td>
                          <td className="table-cell text-zinc-400 text-xs max-w-xs truncate">{t.descripcion || '—'}</td>
                          <td className="table-cell">
                            <div className="flex gap-2">
                              <button onClick={() => abrirEditar(t)} className="btn-edit text-xs">Editar</button>
                              <button onClick={() => abrirEliminar(t)} className="btn-danger text-xs">Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-zinc-700/60">
                  <tr>{['Código','Cliente','Técnico','Descripción','Acciones'].map(h => <th key={h} className="table-header">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtrados.map(t => (
                    <tr key={t._id} className="table-row">
                      <td className="table-cell font-mono text-ticket-400 text-xs font-semibold">{t.codigo}</td>
                      <td className="table-cell font-medium text-white">{t.cliente?.nombre} {t.cliente?.apellido}</td>
                      <td className="table-cell">{t.tecnico?.nombre} {t.tecnico?.apellido}</td>
                      <td className="table-cell text-zinc-400 text-xs max-w-xs truncate">{t.descripcion || '—'}</td>
                      <td className="table-cell">
                        <div className="flex gap-2">
                          <button onClick={() => abrirEditar(t)} className="btn-edit text-xs">Editar</button>
                          <button onClick={() => abrirEliminar(t)} className="btn-danger text-xs">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {(modal === 'crear' || modal === 'editar') && (
        <Modal titulo={modal === 'crear' ? 'Nuevo ticket' : 'Editar ticket'} onClose={cerrar}>
          <form onSubmit={handleGuardar} className="space-y-4">
            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Código *</label><input className="input-field" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} placeholder="TKT-001" required /></div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Cliente *</label>
              <select className="input-field" value={form.cliente} onChange={e => setForm({...form, cliente: e.target.value})} required>
                <option value="">— Selecciona un cliente —</option>
                {clientes.map(c => <option key={c._id} value={c._id}>{c.nombre} {c.apellido} — {c.cedula}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Técnico *</label>
              <select className="input-field" value={form.tecnico} onChange={e => setForm({...form, tecnico: e.target.value})} required>
                <option value="">— Selecciona un técnico —</option>
                {tecnicos.map(t => <option key={t._id} value={t._id}>{t.nombre} {t.apellido} — {t.cedula}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Descripción</label><textarea className="input-field resize-none" rows={3} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Descripción del problema..." /></div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1" disabled={guardando}>{guardando ? 'Guardando...' : modal === 'crear' ? 'Crear ticket' : 'Guardar cambios'}</button>
              <button type="button" onClick={cerrar} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'eliminar' && (
        <Modal titulo="Eliminar ticket" onClose={cerrar}>
          <p className="text-zinc-300 mb-2">¿Estás seguro de eliminar el ticket:</p>
          <p className="text-white font-semibold mb-6">"{sel?.codigo}"</p>
          <Alert tipo="error" mensaje="Esta acción no se puede deshacer." />
          <div className="flex gap-3 mt-5">
            <button onClick={handleEliminar} className="btn-danger flex-1 py-2.5" disabled={guardando}>{guardando ? 'Eliminando...' : 'Sí, eliminar'}</button>
            <button onClick={cerrar} className="btn-secondary flex-1">Cancelar</button>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
