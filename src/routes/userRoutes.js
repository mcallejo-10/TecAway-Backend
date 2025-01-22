// src/routes/userRoutes.js
import { Router } from 'express';
import { getAllUsers,getMyUser, uploadPhoto, updateUser, checkEmailExists, getUserById, getUserSectionsAndKnowledge } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { uploadFileMiddleware } from '../middlewares/upload.js';
import { emailValidator } from '../validations/auth.Validation.js';
// import { updateValidator } from '../validations/user.Validation.js';
// import { idValidator } from '../validations/generic.Validation.js'



const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/get-all-users', getAllUsers);
router.post('/check-email', emailValidator, checkEmailExists);
router.get('/get-user/:id',  getUserById);
router.get('/', authenticateToken(['user','admin' ]), getMyUser);
router.get('/get-user-info/:id', authenticateToken(['user','admin' ]), getUserSectionsAndKnowledge);
router.post('/upload-photo', authenticateToken(['user', 'admin']), uploadFileMiddleware, uploadPhoto);
router.patch('/', authenticateToken(['user','admin' ]),  updateUser);


export default router;
