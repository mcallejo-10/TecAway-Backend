// src/routes/userRoutes.js
import { Router } from 'express';
import { getSections, getSectionById, addSection, updateSection, deleteSection } from '../controllers/sectionController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { sectionValidator } from '../validations/section.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
// router.get('/', authenticateToken(['user']), getUserSections);
// router.get('/:id', authenticateToken(['user','mod','admin']), idValidator, getUserSectionById);
// router.post('/', authenticateToken(['user','mod','admin']), userSectionValidator, addUserSection);
// router.patch('/:id', authenticateToken(['user','mod','admin']), idValidator, userSectionValidator, updateUserSection);
// router.delete('/:id', authenticateToken(['user','mod','admin']), idValidator, deleteUserSection);


export default router;
