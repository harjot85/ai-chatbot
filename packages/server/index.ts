import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';
import { conversationRepository } from './repository/conversation';

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
        const response = await client.responses.create({
            input: prompt,
            model: 'gpt-5-nano3',
            previous_response_id:
                conversationRepository.getLastResponseId(conversationId),
        });

        conversationRepository.setLastResponseId(conversationId, response.id);

        res.json({ message: response.output_text });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate a response' });
    }
});

app.listen(port, () => {
    console.log(`Server is listetning on http://localhost:${port}`);
});
