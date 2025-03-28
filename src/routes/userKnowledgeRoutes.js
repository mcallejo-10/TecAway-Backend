import { Router } from 'express';
import { getUserKnowledgeById , addUserKnowledge, deleteUserKnowledge, getAllUserKnowledges, addUserKnowledgeByAdmin} from '../controllers/userKnowledgeController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { userKnowledgeValidator } from '../validations/userKnowledge.Validation.js';

const router = Router();

router.get('/', getAllUserKnowledges);
router.get('/user', authenticateToken(['user', 'admin']), getUserKnowledgeById);
router.post('/', authenticateToken(['user', 'admin']),  addUserKnowledge);
router.post('/add-by-admin', authenticateToken(['user', 'admin']), addUserKnowledgeByAdmin);
router.delete('/', authenticateToken(['user', 'admin']), deleteUserKnowledge);


export default router;

