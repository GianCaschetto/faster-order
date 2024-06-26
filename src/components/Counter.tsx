type CounterProps = {
  setCounter: (qty: number) => void;
  counter: number
};

function Counter({ setCounter, counter }: CounterProps) {
  const isDisabled = counter == 1;

  return (
    <div className="flex justify-center items-center w-full">

      <button
        disabled={isDisabled}
        onClick={() => setCounter(counter - 1)}
        type="button"
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
        <svg
          className="w-3 h-3 text-gray-900 dark:text-white"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M1 1h16"
          />
        </svg>
      </button>
      <span className="bg-gray-50 border-x-0 border-gray-300 h-11 w-full text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        {counter}
      </span>
      <button
        type="button"
        onClick={() => setCounter(counter + 1)}
        className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
        <svg
          className="w-3 h-3 text-gray-900 dark:text-white"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
  );
}

export default Counter;
