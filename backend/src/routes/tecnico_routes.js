import { Router } from 'express'
import { listarTecnicos, detalleTecnico, crearTecnico, actualizarTecnico, eliminarTecnico } from '../controllers/tecnico_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()
router.get('/',    verificarTokenJWT, listarTecnicos)
router.get('/:id', verificarTokenJWT, detalleTecnico)
router.post('/',   verificarTokenJWT, crearTecnico)
router.put('/:id', verificarTokenJWT, actualizarTecnico)
router.delete('/:id', verificarTokenJWT, eliminarTecnico)
export default router
