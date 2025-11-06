import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

type FormData = {
    prompt: string;
};

type ChatResponse = {
    message: string;
};

type Message = {
    content: string;
    role: 'user' | 'bot';
};

const rules = ' Keep the responses brief. ';

export const Chatbot = () => {
    const conversationId = useRef(crypto.randomUUID());
    const [error, setError] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isfetching, setIsfetching] = useState(false);

    const formRef = useRef<HTMLFormElement | null>(null);

    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const onFormSubmit = async (formData: FormData) => {
        try {
            setError('');
            const parsedData = formData.prompt.trim();
            setMessages((prev) => [
                ...prev,
                { content: parsedData, role: 'user' },
            ]);
            setIsfetching(true);
            reset();

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

    useEffect(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onFormSubmit)();
        }
    };

    const onCopyHandler = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', selection);
        }
    };
    return (
        <div className="px-4 pb-4 flex flex-col flex-1 h-full ">
            <div className="flex flex-col flex-1 gap-4 overflow-x-auto">
                {messages?.map((message, index) => (
                    <div
                        key={index}
                        onCopy={onCopyHandler}
                        className={`rounded-2xl p-4  ${
                            message.role === 'bot'
                                ? 'bg-gray-200 text-black text-left self-start'
                                : 'bg-blue-600 text-white text-right self-end'
                        }`}
                    >
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                ))}
                {isfetching && (
                    <div className="flex bg-gray-200 gap-1 self-start ml-2 px-6 py-4 rounded-2xl">
                        <div className="h-3 w-3 rounded-full bg-gray-700 animate-bounce" />
                        <div className="h-3 w-3 rounded-full bg-gray-600 animate-bounce [animation-delay:0.1s]" />
                        <div className="h-3 w-3 rounded-full bg-gray-500 animate-bounce [animation-delay:0.2s]" />
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
            </div>
            <form
                ref={formRef}
                onKeyDown={handleKeyDown}
                onSubmit={handleSubmit(onFormSubmit)}
                className="flex flex-col gap-4 items-end mt-10 w-full border-2 p-4 rounded-2xl"
            >
                <textarea
                    {...register('prompt', {
                        required: true,
                        validate: (data) => data.trim().length > 0,
                    })}
                    autoFocus
                    className="w-full h-20 rounded-xl focus:outline-0 resize-none"
                    placeholder="Ask Anything"
                    maxLength={1000}
                />
                <Button
                    className="rounded-full w-10 h-10"
                    disabled={!formState.isValid}
                >
                    <FaArrowUp />
                </Button>
            </form>
        </div>
    );
};

export default Chatbot;
