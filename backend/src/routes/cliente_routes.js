import { Router } from 'express'
import { listarClientes, detalleCliente, crearCliente, actualizarCliente, eliminarCliente } from '../controllers/cliente_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()
router.get('/',    verificarTokenJWT, listarClientes)
router.get('/:id', verificarTokenJWT, detalleCliente)
router.post('/',   verificarTokenJWT, crearCliente)
router.put('/:id', verificarTokenJWT, actualizarCliente)
router.delete('/:id', verificarTokenJWT, eliminarCliente)
export default router
