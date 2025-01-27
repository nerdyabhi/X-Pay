import express, { Request, Response } from 'express';
const router = express.Router();
import { userLogin, userSignup, userProfile, editUserProfile } from '../Controllers/userControllers';
import { authUser } from '../middleware/auth.middleware';


/* Routes */
router.post('/signup', userSignup)
router.post('/login', userLogin)

router.get('/profile', authUser ,  userProfile);
router.post('/editProfile', authUser,  editUserProfile);


export default router;