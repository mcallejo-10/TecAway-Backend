// src/routes/userRoutes.js
import { Router } from 'express';
import { getAllUsers,getUser, uploadPhoto } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { uploadFileMiddleware } from '../middlewares/upload.js';


const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/get_all_users', authenticateToken(['user','admin' ]), getAllUsers);
router.get('/', authenticateToken(['user','admin' ]), getUser);
router.post('/upload_photo', authenticateToken(['user', 'admin']), uploadFileMiddleware, uploadPhoto);

export default router;
