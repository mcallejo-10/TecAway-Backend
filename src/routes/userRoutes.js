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

const router = Router();

router.get('/get-all-users', getAllUsers);
router.post('/check-email', emailValidator, checkEmailExists);
router.get('/get-user/:id',  getUserById);
router.get('/', authenticateToken(['user','admin' ]), getMyUser);
router.get('/get-user-info/:id', getUserSectionsAndKnowledge);
router.post('/upload-photo', authenticateToken(['user', 'admin']), uploadFileMiddleware, uploadPhoto);
router.patch('/', authenticateToken(['user','admin' ]),  updateUser);
router.delete('/:id', authenticateToken(['admin', 'user']),deleteUser);


export default router;
