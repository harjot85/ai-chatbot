import { conversationRepository } from '../repositories/conversation.repository';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

type ChatRespose = {
    id: string;
    message: string;
};

export const chatService = {
    async sendMessage(
        prompt: string,
        conversationId: string
    ): Promise<ChatRespose> {
        const response = await client.responses.create({
            input: prompt,
            model: 'gpt-5-nano',
            previous_response_id:
                conversationRepository.getLastResponseId(conversationId),
        });

        conversationRepository.setLastResponseId(conversationId, response.id);

        const serviceResponse: ChatRespose = {
            id: response.id,
            message: response.output_text,
        };

        // ToDo: Before returning the response, it should be validated and potentially sanitized.

        return serviceResponse;
    },
};
