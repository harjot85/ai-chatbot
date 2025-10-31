import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';

import z from 'zod';
import { chatService } from './services/chat.service';

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/api/health', (req: Request, res: Response) => {
    res.json({ message: 'Healthy' });
});

const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Promt is required')
        .max(100, 'max length is 100'),
    conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
        res.status(400).json(parseResult.error.format());
        return;
    }

    const prompt = req.body.prompt;
    const conversationId = req.body.conversationId;

    try {
        const response = await chatService.sendMessage(prompt, conversationId);

        res.json({ message: response.message });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate a response' });
    }
});

app.listen(port, () => {
    console.log(`Server is listetning on http://localhost:${port}`);
});
