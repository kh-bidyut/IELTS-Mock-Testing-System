import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary py-3 px-6"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-primary py-3 px-6"
          >
            Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;