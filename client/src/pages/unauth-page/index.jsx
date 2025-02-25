import { Link } from "react-router-dom";

export default function UnauthPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-7xl font-bold text-red-600">401</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-4">
        Unauthorized Access
      </h2>
      <p className="text-gray-500 mt-2 max-w-md">
        You don't have permission to view this page. Please log in or return to
        the home page.
      </p>

      {/* Unauthorized Image */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/5650/5650943.png"
        alt="Unauthorized"
        className="w-80 mt-6"
      />

      <div className="mt-6 flex gap-4">
        <Link
          to="/auth/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Login
        </Link>
        <Link
          to="/"
          className="px-6 py-3 bg-gray-600 text-white rounded-lg text-lg font-semibold hover:bg-gray-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
