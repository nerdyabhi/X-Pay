const express = require('express');
import { Request, Response } from 'express';
const app = express();


app.get('/', (req: Request, res: Response) => {
    res.send("Hello world");
})

app.listen(3000, () => {
    return console.log(`Express is listening at http://localhost:3000`);
});