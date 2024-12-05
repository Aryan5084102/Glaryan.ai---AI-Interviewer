
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    // Play the question audio when it changes
    if (audioRef.current) {
      audioRef.current.src = questions[currentQuestionIndex].audio;
      audioRef.current.play();
    }
  }, [currentQuestionIndex]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
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

      recorder.start();
      setMediaRecorder(recorder);
      setIsAnswering(true); // Show video recording UI
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Unable to access your camera and microphone.");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsAnswering(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setRecordedChunks([]); // Clear previous recordings
    } else {
      router.push("/completion"); // Navigate to completion screen after the last question
    }
  };

  const handleFinishAnswer = () => {
    stopRecording(); // Stop the recording
    handleNextQuestion(); // Move to the next question
  };

  return (
    <div className="h-screen flex flex-col md:flex-row px-6 md:px-16 lg:px-32 bg-dark-bg">
      {/* Left Section: Question and Audio */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-8">Question</h1>
        <p className="mb-4 text-lg text-center">{questions[currentQuestionIndex].text}</p>

        {/* Audio player */}
        <audio ref={audioRef} controls className="mb-6">
          <source src={questions[currentQuestionIndex].audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* Buttons */}
        {!isAnswering ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Start Answering
          </button>
        ) : (
          <button
            onClick={handleFinishAnswer}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition mt-4"
          >
            Finish Answer
          </button>
        )}
      </div>

      {/* Right Section: Video Recording */}
      {isAnswering && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold mb-4">Recording...</h2>
          <video ref={videoRef} className="w-full max-w-md border border-gray-600 rounded-md" />
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;
