import express from 'express';
import { register, login,update ,verify} from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/update',update);
router.post('/verify',verify);
export default router;
