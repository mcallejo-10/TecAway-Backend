// src/routes/authRoutes.js
import { Router } from 'express';
import { register, login, logout, forgotPassword, changePassword, checkAuth } from '../controllers/authController.js';
import { registerValidator, loginValidator, emailValidator, changePasswordValidator } from '../validations/auth.Validation.js'

const router = Router();

// Rutas para registrarse e iniciar sesión
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/forgot-password', emailValidator, forgotPassword);
router.post('/change-password', changePasswordValidator, changePassword);
router.get('/logout', logout);
router.get('/check-auth', authenticateToken(['user','admin' ]), checkAuth);
export default router;
