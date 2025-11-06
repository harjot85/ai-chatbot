const LoaderSymbol = () => {
    return (
        <div className="flex  gap-1 self-start ml-2 px-6 py-4 rounded-2xl">
            <div className="bg-green-900 h-3 w-3 rounded-full animate-bounce" />
            <div className="bg-green-800 h-3 w-3 rounded-full animate-bounce [animation-delay:0.1s]" />
            <div className="bg-green-700 h-3 w-3 rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
    );
};

export default LoaderSymbol;
