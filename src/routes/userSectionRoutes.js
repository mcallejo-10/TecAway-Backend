// src/routes/userRoutes.js
import { Router } from 'express';
import { getUserSections, getUerSectionById , addUserSection, deleteUserSection} from '../controllers/userSectionController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { userSectionValidator } from '../validations/userSection.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/', authenticateToken(['user', 'admin']), getUserSections);
router.get('/:id', authenticateToken(['user', 'admin']), idValidator, getUerSectionById);
router.post('/', authenticateToken(['user', 'admin']), addUserSection, userSectionValidator);
// router.patch('/:id', authenticateToken(['user','mod','admin']), idValidator, userSectionValidator, updateUserSection);
router.delete('/', authenticateToken(['user', 'admin']), deleteUserSection);


export default router;
