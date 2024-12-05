"use client"

import React, { useEffect, useState } from 'react';

const AnswerRecordingScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      setRecordedChunks((prev) => [...prev, event.data]);
    };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      // send the blob to your API
    };
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Answer Recording</h1>
      <video
        autoPlay
        muted
        width="300"
        height="200"
        className="border border-gray-300 mb-4"
      ></video>
      <div>
        {isRecording ? (
          <button onClick={stopRecording} className="bg-red-500 text-white py-2 px-6 rounded">
            Stop Recording
          </button>
        ) : (
          <button onClick={startRecording} className="bg-blue-500 text-white py-2 px-6 rounded">
            Start Recording
          </button>
        )}
      </div>
    </div>
  );
};

export default AnswerRecordingScreen;
