import { conversationRepository } from '../repositories/conversation.repository';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Keep in mind - Role, Context, Audience, Tone, Output format, Examples (well-formatted, clear, diverse)
// If the Modal is unsure it can say sorry I don't know, do not guess or make up a response

const systemMessage = `You are an expert, friendly and concise travel agent.
Only respond to travel, geography or destination-related queries and politely decline the rest.
Keep responses very short unless a detailed answer is requested.
Use markdown formatting (bold, italics, bullet points).
Ask 1–2 clarifying questions if the request is vague.
Do not guess.`;

type ChatRespose = {
    id: string;
    message: string;
    isFirstMessage?: boolean;
};

export const chatService = {
    async sendMessage(
        userPrompt: string,
        conversationId: string,
        isFirstMessage: boolean
    ): Promise<ChatRespose> {
        console.log('Is First Message (server)', isFirstMessage);

        const response = await client.responses.create({
            model: 'gpt-5-nano',
            input: isFirstMessage
                ? [
                      { role: 'system', content: systemMessage },
                      { role: 'user', content: userPrompt },
                  ]
                : [{ role: 'user', content: userPrompt }],
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
