"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image'

const QuestionScreen: React.FC = () => {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Question data: array of questions with corresponding audio
  const questions = [
    { text: "What are your strengths and weaknesses?", audio: "/question1.mp3" },
    { text: "Describe a challenging project you've worked on.", audio: "/question2.mp3" },
    { text: "Why should we hire you?", audio: "/question3.mp3" },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswering, setIsAnswering] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const mediaStreamRef = useRef<MediaStream | null>(null); // Store media stream reference

  useEffect(() => {
    // Automatically play the question audio when the question changes
    if (audioRef.current) {
      audioRef.current.src = questions[currentQuestionIndex].audio;
      audioRef.current.play();
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    // Start the video feed when the component mounts
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaStreamRef.current = stream; // Store the media stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };

        setMediaRecorder(recorder);
      } catch (error) {
        console.error("Error accessing media devices:", error);
        alert("Unable to access your camera and microphone.");
      }
    };

    initializeMedia();

    // Cleanup: stop the media stream when the component unmounts
    return () => {
      if (mediaStreamRef.current) {
        const tracks = mediaStreamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsAnswering(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setIsAnswering(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRecordedChunks([]); // Clear previous recordings
      setIsAnswering(false); // Reset answering state for the next question
    }
  };

  const handleFinishAnswer = () => {
    stopRecording(); // Stop the recording
    if (currentQuestionIndex < questions.length - 1) {
      handleNextQuestion(); // Move to the next question
    }
  };

  const handleSubmit = () => {
    stopRecording(); // Ensure recording stops before submission

    if (mediaStreamRef.current) {
      const tracks = mediaStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setShowCompletionModal(true); // Show the completion modal
  };

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="h-screen flex flex-row  px-6 md:px-16 lg:px-32 bg-dark-bg">
      {/* Left Section: Question Display */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-10">
          Question ({currentQuestionIndex + 1}/{questions.length})
        </h1>
        <div className="mb-6 text-lg ">
          <p className="p-4 text-white ">
            {questions[currentQuestionIndex].text}
          </p>
        </div>

        {/* Buttons */}
        {!isAnswering ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Start Answering
          </button>
        ) : (
          <div className="flex space-x-4 mt-4">
            <button
              onClick={handleFinishAnswer}
              className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition"
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish Answer" : "Next Question"}
            </button>
            {currentQuestionIndex === questions.length - 1 && (
              <button
                onClick={handleSubmit}
                className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
              >
                Submit
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right Section: Video Recording */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">{isAnswering ? "Recording Answer..." : "Live Preview"}</h2>
        <video ref={videoRef} className="w-full max-w-md border border-gray-600 rounded-md" autoPlay />
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
            <h1 className="text-2xl font-bold mb-4">Test Completed</h1>
            <Image src="https://cdn.dribbble.com/users/28588/screenshots/3669080/media/f469f659f60053c25df8aeca3a7556f1.gif" width={20} height={20} alt="Error" />
            <p className="text-lg mb-6">Thank you for completing the AI interview test.</p>
            <button
              onClick={handleClose}
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;
