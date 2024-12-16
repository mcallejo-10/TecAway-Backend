import { Router } from 'express';
import { getUserKowledge, getUserKnowledgeById , addUserKnowledge, deleteUserKnowledge} from '../controllers/userKnowledgeController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { userKnowledgeValidator } from '../validations/userKnowledge.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/', authenticateToken(['user', 'admin']), getUserKowledge);
router.get('/:id', authenticateToken(['user', 'admin']), idValidator, getUserKnowledgeById);
router.post('/', authenticateToken(['user', 'admin']), addUserKnowledge, userKnowledgeValidator);
router.delete('/', authenticateToken(['user', 'admin']), deleteUserKnowledge);


export default router;