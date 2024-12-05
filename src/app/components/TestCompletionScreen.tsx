"use client"

import React from 'react';
import { useRouter } from 'next/navigation';

const TestCompletionScreen = () => {
  const router = useRouter();

  const handleRestart = () => {
    router.push('/'); // Redirect to the home/instruction screen
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center ">
      <h1 className="text-3xl font-bold mb-4">Test Completed</h1>
      <p className="text-lg mb-6">Thank you for completing the AI interview test.</p>
      <button
        onClick={handleRestart}
        className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
      >
        Back to Home
      </button>
    </div>
  );
};

export default TestCompletionScreen;
