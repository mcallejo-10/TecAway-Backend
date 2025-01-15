import { Router } from 'express';
import { getUserKnowledge, getUserKnowledgeById , addUserKnowledge, deleteUserKnowledge} from '../controllers/userKnowledgeController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { userKnowledgeValidator } from '../validations/userKnowledge.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/', getUserKnowledge);
router.get('/', authenticateToken(['user', 'admin']), getUserKnowledgeById);
router.post('/', authenticateToken(['user', 'admin']), addUserKnowledge, userKnowledgeValidator);
router.delete('/', authenticateToken(['user', 'admin']), deleteUserKnowledge);

export default router;

