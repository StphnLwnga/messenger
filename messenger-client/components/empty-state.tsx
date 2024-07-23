const EmptyState = () => {
  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8 h-full flex justify-center items-center bg-gray-100 dark:bg-slate-950">
      <div className="flex flex-col text-center items-center">
        <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-300">
          Select a chat or start a new conversation.
        </h3>
      </div>
    </div>
  );
}

export default EmptyState;