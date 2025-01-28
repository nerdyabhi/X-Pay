import express, { Request, Response } from 'express';

import { authUser } from '../middleware/auth.middleware';
import { getTransactionHistory, sendMoney } from '../Controllers/transactionController';
const router = express.Router();

/* Routes */
router.post('/new', authUser, sendMoney);

router.get('/history', authUser, getTransactionHistory)
export default router;