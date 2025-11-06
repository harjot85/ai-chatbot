import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ChatInput, { type ChatFormData } from './ChatInput';
import LoaderSymbol from './LoaderSymbol';
import ChatMessage, { type Message } from './ChatMessage';

type ChatResponse = {
    message: string;
};

// Keep in mind - Role, Context, Audience, Tone, Output format, Examples (well-formatted, clear, diverse)
// If the Modal is unsure it can say sorry I don't know, do not guess or make up a response

const groundContext = `You are an expert in travelling. Your role is assist the clients with best knowlegde in a friendly tone.  
                Keep the reponses very short unless the clients specifically request for a desctiptive response. 
                Use markdown wherever possible. Use bullet points, bolds and italics whereever possible. 
                If the requst is too vague, ask 1 or 2 questions to clarify. Do not guess.
                Here is their query: `;

export const Chatbot = () => {
    const [error, setError] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isfetching, setIsfetching] = useState(false);

    const conversationId = useRef(crypto.randomUUID());

    const onFormSubmit = async (formData: ChatFormData) => {
        try {
            setError('');
            const parsedData = formData.prompt.trim();
            setMessages((prev) => [
                ...prev,
                { content: parsedData, role: 'user' },
            ]);
            setIsfetching(true);

            const prompt =
                messages.length === 0 ? groundContext + parsedData : parsedData;

            const { data } = await axios.post<ChatResponse>('/api/chat', {
                prompt: prompt,
                conversationId: conversationId.current,
            });

            setMessages((prev) => [
                ...prev,
                { content: data.message, role: 'bot' },
            ]);
            setIsfetching(false);
            console.log(data);
        } catch (error) {
            console.error(error);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsfetching(false);
        }
    };

    const formRef = useRef<HTMLFormElement | null>(null);

    useEffect(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="px-4 pb-4 flex flex-col flex-1 h-full pt-10 bg-gray-950">
            <div className="flex text-4xl justify-center text-white">
                Travel GPT
            </div>
            <div className="flex self-center border-b-2 border-green-900 mt-5 w-2xl" />
            <div className="flex self-center border-b-2 border-green-900 mt-1 mb-10 w-2xl" />
            <div className="flex flex-col flex-1 gap-4 overflow-x-auto">
                {messages?.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                ))}
                {isfetching && <LoaderSymbol />}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <ChatInput onFormSubmit={onFormSubmit} formRef={formRef} />
        </div>
    );
};

export default Chatbot;
