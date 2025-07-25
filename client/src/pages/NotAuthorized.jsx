// src/pages/NotAuthorized.jsx
import React from 'react';

const NotAuthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-red-600">
      <h1 className="text-3xl font-bold mb-4">🚫 Access Denied</h1>
      <p className="text-lg">You are not authorized to view this page.</p>
    </div>
  );
};

export default NotAuthorized;
