import { Router } from 'express'
import { listarTickets, detalleTicket, crearTicket, actualizarTicket, eliminarTicket } from '../controllers/ticket_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()
router.get('/',    verificarTokenJWT, listarTickets)
router.get('/:id', verificarTokenJWT, detalleTicket)
router.post('/',   verificarTokenJWT, crearTicket)
router.put('/:id', verificarTokenJWT, actualizarTicket)
router.delete('/:id', verificarTokenJWT, eliminarTicket)
export default router
