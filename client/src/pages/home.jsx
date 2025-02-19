import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navigation Header */}
      <nav className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h2 className="text-2xl font-bold text-blue-600">E-Shop</h2>
          <div className="space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Shop
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Categories
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Cart
            </a>
            <Link
              to={"/auth/login"}
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-16 text-center">
        <h1 className="text-4xl font-bold">Welcome to E-Shop</h1>
        <p className="mt-4 text-lg">
          Find the best products at unbeatable prices.
        </p>
        <button className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
          Shop Now
        </button>
      </header>

      {/* Features Section */}
      <section className="container mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Wide Range</h3>
          <p className="mt-2 text-gray-600">
            Explore a vast collection of products.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Best Deals</h3>
          <p className="mt-2 text-gray-600">Unbeatable discounts and offers.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Secure Payments</h3>
          <p className="mt-2 text-gray-600">
            Safe and reliable transaction methods.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
