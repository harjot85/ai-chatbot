import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ChatInput, { type ChatFormData } from './ChatInput';
import LoaderSymbol from './LoaderSymbol';
import ChatMessage, { type Message } from './ChatMessage';
import popSound from '@/assets/sounds/pop.mp3';
import notificationSound from '@/assets/sounds/notification.mp3';

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;

const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

type ChatResponse = {
    message: string;
};

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
            popAudio.play();

            const isFirstMessage = messages.length < 1;
            console.log('isFirstMessage', isFirstMessage);

            const { data } = await axios.post<ChatResponse>('/api/chat', {
                prompt: parsedData,
                isFirstMessage: isFirstMessage,
                conversationId: conversationId.current,
            });

            setMessages((prev) => [
                ...prev,
                { content: data.message, role: 'bot' },
            ]);
            setIsfetching(false);
            notificationAudio.play();
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
            <div className="flex flex-col flex-1 gap-4 overflow-x-auto px-8">
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
