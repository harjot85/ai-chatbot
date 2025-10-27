// console.log("Hello via Bun!");

import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('', (req: Request, res: Response) => {
    res.send('Hello Bunn!');
});

app.get('/api/test', (req: Request, res: Response) => {
    res.json({ message: 'Test Successful!' });
});

const conversations = new Map<string, string>();

app.post('/api/chat', async (req: Request, res: Response) => {
    const prompt = req.body.prompt;
    const conversationId = req.body.conversationId;

    console.log('Body', req.body);

    const response = await client.responses.create({
        input: prompt,
        model: 'gpt-5-nano',
        previous_response_id: conversations.get(conversationId),
    });

    conversations.set(conversationId, response.id);

    res.json({ message: response.output_text });
});

app.listen(port, () => {
    console.log(`Server is listetning on http://localhost:${port}`);
});
