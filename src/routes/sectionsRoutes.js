// src/routes/userRoutes.js
import { Router } from 'express';
import { getSections, getSectionById, addSection, updateSection, deleteSection } from '../controllers/sectionController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { sectionValidator } from '../validations/section.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/', authenticateToken(['user']), getSections);
router.get('/:id', authenticateToken(['user','mod','admin']), idValidator, getSectionById);
router.post('/', authenticateToken(['user','mod','admin']), sectionValidator, addSection);
router.patch('/:id', authenticateToken(['user','mod','admin']), idValidator, sectionValidator, updateSection);
router.delete('/:id', authenticateToken(['user','mod','admin']), idValidator, deleteSection);
// router.get('/top-ventas', getSections);

export default router;
