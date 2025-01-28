const express = require('express');
import { json, Request, Response, urlencoded } from 'express';
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
// import {connectToDB} from './db/dbConnect';

/** Importing  Routes */
import userRouter from './routes/userRoutes';
import transactionRouter from './routes/transactionRoute';

/* Middle Ware Setup */
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


/* Database Connection  */

// connectToDB();

/* Using Routes */
app.use('/user', userRouter);
app.use('/transaction', transactionRouter);


// Server Listening
app.listen(3000, () => {
    return console.log(`Server is running at http://localhost:3000`);
});