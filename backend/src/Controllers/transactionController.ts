import { Request, Response } from 'express';
import { newTransactionSchema } from '../validation/transaction.validation';
import { findUserByEmail, transferMoney } from '../db/rawQueries';

const sendMoney = async (req: Request, res: Response) => {
    const result = newTransactionSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: "Please provide valid reciever's email" });
        return;
    }
    const { reciever_email, amount } = req.body;

    const sender = req.body.user;

    if (sender.email === reciever_email) {
        res.status(400).json({ message: "Can't send money to yourself !" });
        return;
    }
    const reciever = await findUserByEmail(reciever_email);

    if (sender.balance < amount) {
        res.status(400).json({ message: "Insuffiecient balance !" });
        return;
    }

    if (!reciever) {
        res.status(404).json({ message: "No user found for that email !" });
        return;
    }

    const confirmation = await transferMoney(sender.user_id, reciever.user_id, amount);
    if (!confirmation) {
        res.status(500).json({ message: "Couldn't Complete the transaction" });
        return;
    }

    res.status(200).json({ message: "Succesfully transfered the money to " + reciever_email })


}

export { sendMoney };