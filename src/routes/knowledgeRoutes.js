// src/routes/userRoutes.js
import { Router } from 'express';
import { getKnowledge, getKnowledgeById, addKnowledge, updateKnowledge, deleteKnowledge } from '../controllers/knowledgeController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import {knowledgeValidator } from '../validaknowledge.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los conocimientos
router.get('/', authenticateToken(['user']), getKnowledge);
router.get('/:id', authenticateToken(['user', 'admin']), idValidator, getKnowledgeById);
router.post('/', authenticateToken(['admin']), knowledgeValidator, addKnowledge);
router.patch('/:id', authenticateToken(['admin']), idValidator, knowledgeValidator, updateKnowledge);
router.delete('/:id', authenticateToken(['admin']), idValidator, deleteKnowledge);


export default router;
