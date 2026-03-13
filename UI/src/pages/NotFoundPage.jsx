import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
        <p className="text-3xl font-bold text-gray-900 mt-4">Something's missing.</p>
        <p className="text-gray-500 mt-2">Sorry, we can't find that page.</p>
        <Link to="/" className="inline-block mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
