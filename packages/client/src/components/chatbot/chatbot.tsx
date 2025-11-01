import { Button } from '../ui/button';
import { FaArrowUp } from 'react-icons/fa';

export const Chatbot = () => {
    return (
        <div className="flex flex-col gap-4 items-end m-4 w-full border-2 p-4 rounded-2xl">
            <textarea
                className="w-full h-50 rounded-xl focus:outline-0 resize-none"
                placeholder="Ask Anything"
                maxLength={1000}
            />
            <Button className="rounded-full w-10 h-10">
                <FaArrowUp />
            </Button>
        </div>
    );
};

export default Chatbot;
