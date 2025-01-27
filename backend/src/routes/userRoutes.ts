import express, { Request, Response } from 'express';
const router = express.Router();
import { userLogin, userSignup, userProfile, editUserProfile } from '../Controllers/userControllers';


/* Routes */
router.post('/signup', userSignup)
router.post('/login', userLogin)

router.get('/profile', userProfile)
router.post('/editProfile', editUserProfile)


export default router;