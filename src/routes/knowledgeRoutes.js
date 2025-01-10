// src/routes/userRoutes.js
import { Router } from 'express';
import { getKnowledge, getKnowledgeById, addKnowledge, updateKnowledge, deleteKnowledge } from '../controllers/knowledgeController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import {knowledgeValidator } from '../validations/knowledge.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los conocimientos
router.get('/', getKnowledge);
router.get('/:id', idValidator, getKnowledgeById);
router.post('/', authenticateToken(['admin']), knowledgeValidator, addKnowledge);
router.put('/:id', authenticateToken(['user', 'admin']), idValidator, knowledgeValidator, updateKnowledge);
router.delete('/:id', authenticateToken(['admin']), idValidator, deleteKnowledge);


export default router;
