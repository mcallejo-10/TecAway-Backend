// src/routes/userRoutes.js
import { Router } from 'express';
import { 
  getAllUsers,
  getMyUser,
  uploadPhoto,
  updateUser,
  checkEmailExists,
  getUserById,
  getUserSectionsAndKnowledge,
  deleteUser  // Add this import
} from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { uploadFileMiddleware } from '../middlewares/upload.js';
import { emailValidator } from '../validations/auth.Validation.js';
import geocodeMiddleware from '../middlewares/geocodeMiddleware.js';

const router = Router();

router.get('/get-all-users', getAllUsers);
router.post('/check-email', emailValidator, checkEmailExists);
router.get('/get-user/:id',  getUserById);
router.get('/', authenticateToken(['user','admin' ]), getMyUser);
router.get('/get-user-info/:id', getUserSectionsAndKnowledge);
router.post('/upload-photo', authenticateToken(['user', 'admin']), uploadFileMiddleware, uploadPhoto);
router.patch('/', authenticateToken(['user','admin']), geocodeMiddleware, updateUser);
router.delete('/:id', authenticateToken(['admin', 'user']),deleteUser);


export default router;


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id_user:
 *           type: integer
 *           description: ID único del usuario
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Email del usuario
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: Rol del usuario
 *         image:
 *           type: string
 *           description: URL de la imagen de perfil
 * 
 * /user:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 * 
 * /user/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
/**
 * @swagger
 * /user/get-all-users:
 *   get:
 *     summary: Obtiene lista de todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *
 * /user/check-email:
 *   post:
 *     summary: Verifica si un email ya existe
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verificación exitosa
 *
 * /user/get-user/{id}:
 *   get:
 *     summary: Obtiene usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *
 * /user/get-user-info/{id}:
 *   get:
 *     summary: Obtiene información detallada del usuario incluyendo secciones y conocimientos
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Información del usuario obtenida exitosamente
 *
 * /user/upload-photo:
 *   post:
 *     summary: Sube foto de perfil
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto subida exitosamente
 *
 * /user:
 *   patch:
 *     summary: Actualiza información del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *
 * /user/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Usuarios]
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
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
/**
 * /user:
 *   get:
 *     summary: Obtiene información del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario actual
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado o token no válido
 *       404:
 *         description: Usuario no encontrado
 */
