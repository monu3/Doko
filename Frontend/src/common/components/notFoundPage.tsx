import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="text-center max-w-md">
        {/* Illustration */}
        <div className="animate-bounce">
          <svg
            className="w-24 h-24 mx-auto text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-9xl font-bold text-gray-700 dark:text-gray-300">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mt-2">
          Oops! Page not found.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-4">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
  