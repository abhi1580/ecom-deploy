import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-8xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mt-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      {/* Alternative image solution */}
      <img
        src="https://illustrations.popsy.co/white/resistance-band.svg"
        alt="Not Found"
        className="w-80 mt-6"
      />

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
