import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from '../controllers/chat.controller';

const router = express.Router();

router.get('/api/health', (req: Request, res: Response) => {
    res.json({ message: 'Healthy' });
});

router.post('/api/chat', chatController.sendMessage);

export default router;
