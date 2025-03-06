"use client"; // Required in Next.js App Router

import { useState, useEffect } from "react";
import { LuAudioLines } from "react-icons/lu";

export default function VoiceRecorder({ onTranscription, iconSize }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create SpeechRecognition instance
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false; // Stop after first speech
        recognitionInstance.interimResults = false; // Get only final results
        recognitionInstance.lang = "en-US"; // Set language

        // Event Listener: When speech is recognized
        recognitionInstance.onresult = (event) => {
          const text = event.results[0][0].transcript; // Get transcribed text
          setTranscription(text); // Save transcription
          onTranscription(text);
        };

        // Event Listener: Reset when recording stops
        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
      } else {
        console.warn("Speech recognition is not supported in this browser.");
      }
    }
  }, [onTranscription]);

  // Start or Stop Recording
  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop(); // Stop recording
    } else {
      setTranscription(""); // Clear previous text
      recognition.start(); // Start recording
    }
    setIsRecording(!isRecording);
  };

  return (
    <div className="relative flex flex-col items-center">
      <button onClick={toggleRecording} className={`m-4`}>
        <LuAudioLines
          className={`${iconSize} ${
            isRecording ? "text-red-500" : "text-text hover:text-text_light"
          }`}
        />
      </button>
    </div>
  );
}
