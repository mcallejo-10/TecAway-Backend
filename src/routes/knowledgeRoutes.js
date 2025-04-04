// src/routes/userRoutes.js
import { Router } from 'express';
import { getKnowledge, getKnowledgeById, addKnowledge, updateKnowledge, deleteKnowledge } from '../controllers/knowledgeController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import {knowledgeValidator } from '../validations/knowledge.Validation.js';
import { idValidator } from '../validations/generic.Validation.js'

const router = Router();

router.get('/', getKnowledge);
router.get('/:id', idValidator, getKnowledgeById);
router.post('/', authenticateToken(['admin']), knowledgeValidator, addKnowledge);
router.put('/:id', authenticateToken(['user', 'admin']), idValidator, knowledgeValidator, updateKnowledge);
router.delete('/:id', authenticateToken(['admin']), idValidator, deleteKnowledge);


export default router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Knowledge:
 *       type: object
 *       properties:
 *         id_knowledge:
 *           type: integer
 *           description: ID único del conocimiento
 *         name:
 *           type: string
 *           description: Nombre del conocimiento
 *         description:
 *           type: string
 *           description: Descripción del conocimiento
 *         id_section:
 *           type: integer
 *           description: ID de la sección a la que pertenece
 * 
 * /knowledge:
 *   get:
 *     summary: Obtiene todos los conocimientos
 *     tags: [Conocimientos]
 *     responses:
 *       200:
 *         description: Lista de conocimientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Knowledge'
 *   post:
 *     summary: Crea un nuevo conocimiento
 *     tags: [Conocimientos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - id_section
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               id_section:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Conocimiento creado exitosamente
 *       401:
 *         description: No autorizado
 * 
 * /knowledge/{id}:
 *   get:
 *     summary: Obtiene un conocimiento por ID
 *     tags: [Conocimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conocimiento encontrado
 *       404:
 *         description: Conocimiento no encontrado
 *   put:
 *     summary: Actualiza un conocimiento
 *     tags: [Conocimientos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - id_section
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               id_section:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Conocimiento actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Conocimiento no encontrado
 *   delete:
 *     summary: Elimina un conocimiento
 *     tags: [Conocimientos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conocimiento eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Conocimiento no encontrado
 */
