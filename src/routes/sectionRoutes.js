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


/**
 * @swagger
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       properties:
 *         id_section:
 *           type: integer
 *           description: ID único de la sección
 *         name:
 *           type: string
 *           description: Nombre de la sección
 *         description:
 *           type: string
 *           description: Descripción de la sección
 * 
 * /section:
 *   get:
 *     summary: Obtiene todas las secciones
 *     tags: [Secciones]
 *     responses:
 *       200:
 *         description: Lista de secciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Section'
 *   post:
 *     summary: Crea una nueva sección
 *     tags: [Secciones]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sección creada exitosamente
 *       401:
 *         description: No autorizado
 * 
 * /section/{id}:
 *   get:
 *     summary: Obtiene una sección por ID
 *     tags: [Secciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sección encontrada
 *       404:
 *         description: Sección no encontrada
 *   put:
 *     summary: Actualiza una sección
 *     tags: [Secciones]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sección actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Sección no encontrada
 *   delete:
 *     summary: Elimina una sección
 *     tags: [Secciones]
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
 *         description: Sección eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Sección no encontrada
 */
