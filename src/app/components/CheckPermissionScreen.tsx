"use client";

import React, { useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";

interface CheckPermissionModalProps {
  onClose: () => void; 
}

const CheckPermissionModal: React.FC<CheckPermissionModalProps> = ({ onClose }) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkPermissions = async () => {
    setIsChecking(true); 
    setErrorMessage(""); 
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      await navigator.mediaDevices.getDisplayMedia();

      setPermissionGranted(true);
    } catch (error) {
      setErrorMessage(
        "Permissions denied. Please enable camera, microphone, and screen sharing permissions to proceed."
      );
    } finally {
      setIsChecking(false); 
    }
  };

  const navigateToQuestion = () => {
    router.push("/question"); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg p-10 w-full max-w-md shadow-lg transform transition-transform scale-100 animate-fade-in">
        <div className="flex flex-col justify-center items-center">
          <BsExclamationCircle size={40} className="text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Permission Check</h1>
          <p className="mb-4 text-center">
            We need access to your camera, microphone, and screen to proceed.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-500 text-white text-sm p-2 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <div className="text-center">
          {isChecking ? (
            <AiOutlineLoading3Quarters size={28} className="text-green-500 animate-spin mx-auto mb-4" />
          ) : !permissionGranted ? (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              onClick={checkPermissions}
              disabled={isChecking}
            >
              Grant Access
            </button>
          ) : (
            <p className="text-purple-500 mb-4">Permissions granted! You may continue.</p>
          )}
        </div>

        <div className="flex justify-center">
          {permissionGranted && (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg--600 transition-colors"
              onClick={navigateToQuestion}
            >
              Continue
            </button>
          )}
        </div>

        <button
          className="absolute top-3 right-3 text-white hover:text-gray-300 text-2xl"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CheckPermissionModal;
