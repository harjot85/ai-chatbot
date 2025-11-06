import React from 'react';
import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export type ChatFormData = {
    prompt: string;
};

type Props = {
    onFormSubmit: (data: ChatFormData) => void;
    formRef: React.RefObject<HTMLFormElement | null>;
};

const ChatInput = ({ onFormSubmit, formRef }: Props) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleFormSubmit();
        }
    };

    const { register, handleSubmit, reset, formState } =
        useForm<ChatFormData>();
    const handleFormSubmit = handleSubmit((data) => {
        reset({ prompt: '' });
        onFormSubmit(data);
    });

    return (
        <form
            ref={formRef}
            onKeyDown={handleKeyDown}
            onSubmit={handleFormSubmit}
            className="flex flex-col gap-4 items-end mt-10 w-full border-2 p-4 rounded-2xl"
        >
            <textarea
                {...register('prompt', {
                    required: true,
                    validate: (data) => data.trim().length > 0,
                })}
                autoFocus
                className="w-full h-20 rounded-xl focus:outline-0 resize-none text-white"
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
    );
};

export default ChatInput;
