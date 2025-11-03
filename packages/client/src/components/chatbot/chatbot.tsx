import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef, useState } from 'react';

type FormData = {
    prompt: string;
};

type ChatResponse = {
    message: string;
};

const rules =
    '  Where appropriate, add some humor to the message. Keep the responses brief. ';

export const Chatbot = () => {
    const conversationId = useRef(crypto.randomUUID());
    const [messages, setMessages] = useState<string[]>([]);

    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    const onFormSubmit = async (formData: FormData) => {
        const parsedData = formData.prompt.trim();
        setMessages((prev) => [...prev, parsedData]);
        reset();

        const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt: parsedData + rules,
            conversationId: conversationId.current,
        });

        setMessages((prev) => [...prev, data.message]);
        console.log(data);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onFormSubmit)();
        }
    };

    return (
        <div>
            {messages &&
                messages.map((message, index) => (
                    <p
                        key={index}
                        className="bg-gray-400 rounded-2xl p-4 border-2"
                    >
                        {message}
                    </p>
                ))}
            <form
                onKeyDown={handleKeyDown}
                onSubmit={handleSubmit(onFormSubmit)}
                className="flex flex-col gap-4 items-end m-4 w-full border-2 p-4 rounded-2xl"
            >
                <textarea
                    {...register('prompt', {
                        required: true,
                        validate: (data) => data.trim().length > 0,
                    })}
                    className="w-full h-50 rounded-xl focus:outline-0 resize-none"
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
