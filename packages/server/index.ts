// console.log("Hello via Bun!");

import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('', (req: Request, res: Response) => {
    res.send('Hello Bunn!');
});

app.get('/api/test', (req: Request, res: Response) => {
    res.json({ message: 'Test Successful!' });
});

app.listen(port, () => {
    console.log(`Server is listetning on http://localhost:${port}`);
});
