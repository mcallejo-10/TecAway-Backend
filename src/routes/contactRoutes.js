import { Router } from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const router = Router();

router.post('/send-message', sendContactMessage);

export default router;


/**
 * @swagger
 * components:
 *   schemas:
 *     ContactMessage:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la persona que contacta
 *         email:
 *           type: string
 *           format: email
 *           description: Email de contacto
 *         message:
 *           type: string
 *           description: Mensaje de contacto
 * 
 * /contact/send-message:
 *   post:
 *     summary: Envía un mensaje de contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mensaje enviado exitosamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error al enviar el mensaje
 */