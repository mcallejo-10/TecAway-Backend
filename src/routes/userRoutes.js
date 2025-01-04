// src/routes/userRoutes.js
import { Router } from 'express';
import { getAllUsers,getUser, uploadPhoto, updateUser, checkEmailExists, getUserById } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { uploadFileMiddleware } from '../middlewares/upload.js';
import { emailValidator } from '../validations/auth.Validation.js';
// import { updateValidator } from '../validations/user.Validation.js';
// import { idValidator } from '../validations/generic.Validation.js'



const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/:id', authenticateToken(['user','admin' ]), getUserById);

router.get('/get-all-users', authenticateToken(['user','admin' ]), getAllUsers);
router.post('/check-email', emailValidator, checkEmailExists);
router.get('/', authenticateToken(['user','admin' ]), getUser);
router.post('/upload-photo', authenticateToken(['user', 'admin']), uploadFileMiddleware, uploadPhoto);
router.patch('/', authenticateToken(['user','admin' ]),  updateUser);


export default router;
