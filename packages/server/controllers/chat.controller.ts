import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, 'Promt is required')
        .max(100, 'max length is 100'),
    conversationId: z.uuid(),
});

export const chatController = {
    async sendMessage(req: Request, res: Response) {
        const parseResult = chatSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json(parseResult.error.format());
            return;
        }

        try {
            const prompt = req.body.prompt;
            const conversationId = req.body.conversationId;

            const response = await chatService.sendMessage(
                prompt,
                conversationId
            );

            res.json({ message: response.message });
        } catch (error) {
            res.status(500).json({ error: 'Failed to generate a response' });
        }
    },
};
