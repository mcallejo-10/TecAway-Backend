import { Router } from 'express';
import { getUserCompetences, getUserCompetenceById , addUserCompetence, deleteUserCompetence} from '../controllers/userCompetenceController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { userCompetenceValidator } from '../validations/userCompetence.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/', authenticateToken(['user', 'admin']), getUserCompetences);
router.get('/:id', authenticateToken(['user', 'admin']), idValidator, getUserCompetenceById);
router.post('/', authenticateToken(['user', 'admin']), addUserCompetence, userCompetenceValidator);
router.delete('/', authenticateToken(['user', 'admin']), deleteUserCompetence);


export default router;