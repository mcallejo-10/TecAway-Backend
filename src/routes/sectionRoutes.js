// src/routes/userRoutes.js
import { Router } from 'express';
import { getSections, getSectionById, addSection, updateSection, deleteSection } from '../controllers/sectionController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { sectionValidator } from '../validations/section.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

router.get('/', getSections);
router.get('/:id', idValidator, getSectionById);
router.post('/', authenticateToken(['admin']), sectionValidator, addSection);
router.put('/:id', authenticateToken(['admin']), idValidator, sectionValidator, updateSection);
router.delete('/:id', authenticateToken(['admin']), idValidator, deleteSection);


export default router;
