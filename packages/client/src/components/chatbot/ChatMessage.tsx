import ReactMarkdown from 'react-markdown';

export type Message = {
    content: string;
    role: 'user' | 'bot';
};

type ChatMessageProps = {
    message: Message;
};

const ChatMessage = ({ message }: ChatMessageProps) => {
    const onCopyHandler = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
        const selection = window.getSelection()?.toString().trim();
        if (selection) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', selection);
        }
    };
    return (
        <div
            onCopy={onCopyHandler}
            className={`rounded-2xl p-4  ${
                message.role === 'bot'
                    ? 'bg-gray-200 text-black text-left self-start'
                    : 'bg-blue-600 text-white text-right self-end'
            }`}
        >
            <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
    );
};

export default ChatMessage;
