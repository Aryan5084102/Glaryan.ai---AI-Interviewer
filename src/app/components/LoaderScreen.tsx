"use client"

import React from 'react';

const LoaderScreen = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="loader mb-4 border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      <h1 className="text-2xl font-bold">Processing...</h1>
      <p className="text-gray-600 mt-2">Please wait while we process your answer.</p>
    </div>
  );
};

export default LoaderScreen;
