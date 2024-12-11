// src/routes/userRoutes.js
import { Router } from 'express';
import { getGeneralCompetences, getGeneralCompetenceById, addGeneralCompetence, updateGeneralCompetence, deleteGeneralCompetence } from '../controllers/generalCompetenceController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import {generalCompetenceValidator } from '../validations/generalCompetence.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

// Rutas para obtener y modificar los datos de los conocimientos
router.get('/', authenticateToken(['user', 'admin']), getGeneralCompetences);
router.get('/:id', authenticateToken(['user', 'admin']), idValidator, getGeneralCompetenceById);
router.post('/', authenticateToken(['admin']), generalCompetenceValidator, addGeneralCompetence);
router.patch('/:id', authenticateToken(['admin']), idValidator, generalCompetenceValidator, updateGeneralCompetence);
router.delete('/:id', authenticateToken(['admin']), idValidator, deleteGeneralCompetence);;


export default router;
