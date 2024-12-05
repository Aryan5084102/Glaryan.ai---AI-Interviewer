"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CheckPermissionModal from "./CheckPermissionScreen";

const InstructionScreen: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNext = () => {
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };

  return (
    <div className="flex flex-col items-center h-screen px-6 md:px-16 lg:px-32 bg-dark-bg">
      <h1 className="text-3xl lg:text-4xl font-bold my-10">AI Interview Trainee</h1>
      <div className="max-w-4xl w-full">
        <div className="flex flex-col items-center justify-between gap-8">
          <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Ensure stable internet and choose a clean, quiet location.</li>
              <li>
                Permission for access to the camera, microphone, and screen sharing is
                required.
              </li>
              <li>Be in professional attire and avoid distractions.</li>
              <li>
                Give a detailed response, providing as much information as you can.
              </li>
              <li>
                Answer the question with examples and projects you’ve worked on.
              </li>
            </ol>
          </div>

          <div className="mt-4">
            <button
              onClick={handleNext}
              className="bg-button-blue text-white py-3 px-8 rounded-lg text-lg bg-green-500 hover:bg-green-600 transition"
            >
              Start Now
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <CheckPermissionModal onClose={handleCloseModal} />}
    </div>
  );
};

export default InstructionScreen;
