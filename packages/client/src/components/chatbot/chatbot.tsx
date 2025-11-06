import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ChatInput, { type ChatFormData } from './ChatInput';
import LoaderSymbol from './LoaderSymbol';
import ChatMessage, { type Message } from './ChatMessage';

type ChatResponse = {
    message: string;
};

const rules = ' Keep the responses brief. ';

export const Chatbot = () => {
    const conversationId = useRef(crypto.randomUUID());
    const [error, setError] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isfetching, setIsfetching] = useState(false);

    const onFormSubmit = async (formData: ChatFormData) => {
        try {
            setError('');
            const parsedData = formData.prompt.trim();
            setMessages((prev) => [
                ...prev,
                { content: parsedData, role: 'user' },
            ]);
            setIsfetching(true);

            const { data } = await axios.post<ChatResponse>('/api/chat', {
                prompt: parsedData + rules,
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
        <div className="px-4 pb-4 flex flex-col flex-1 h-full ">
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
