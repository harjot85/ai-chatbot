const LoaderSymbol = () => {
    return (
        <div className="flex bg-gray-200 gap-1 self-start ml-2 px-6 py-4 rounded-2xl">
            <div className="bg-gray-700 h-3 w-3 rounded-full animate-bounce" />
            <div className="bg-gray-600 h-3 w-3 rounded-full animate-bounce [animation-delay:0.1s]" />
            <div className="bg-gray-500 h-3 w-3 rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
    );
};

export default LoaderSymbol;
