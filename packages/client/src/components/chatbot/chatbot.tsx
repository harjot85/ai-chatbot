import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

type FormData = {
    prompt: string;
};

export const Chatbot = () => {
    const { register, handleSubmit, reset, formState } = useForm<FormData>();

    function onFormSubmit(data: FormData) {
        reset();

        const parsedData = data.prompt.trim();
        console.log(parsedData);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onFormSubmit)();
        }
    };

    return (
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
    );
};

export default Chatbot;
