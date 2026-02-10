import React, { useState, useRef } from 'react';

const SpeakingTestComponent = ({ question, onAnswerChange, answer }) => {
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        onAnswerChange(audioUrl);
        
        // Clean up the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      startTimer();

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        onAnswerChange(audioUrl);
        
        // Clean up the stream
        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
        stopTimer();
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      stopTimer();
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsTimerRunning(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
    }
  };

  return (
    <div className="speaking-test-component">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Speaking Question</h3>
        <p className="text-gray-700 mb-4">{question.questionText}</p>
        
        {question.media && question.mediaType === 'audio' && (
          <div className="mb-4">
            <audio controls className="w-full">
              <source src={question.media} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        
        {question.media && question.mediaType === 'image' && (
          <div className="mb-4">
            <img 
              src={question.media} 
              alt="Question visual aid" 
              className="max-w-full h-auto rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-semibold">
              <div className="text-sm">Time Elapsed</div>
              <div className="text-xl">{formatTime(timer)}</div>
            </div>
            
            {recordedAudio && (
              <button
                onClick={playRecording}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Play Recording
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            {!recording ? (
              <button
                onClick={startRecording}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop Recording
              </button>
            )}
          </div>
        </div>

        {recording && (
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></div>
              <span className="text-red-600 font-medium">Recording...</span>
            </div>
          </div>
        )}

        {recordedAudio && (
          <div className="mt-4 p-4 bg-white rounded border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Recording captured</span>
              <span className="text-sm text-gray-600">{formatTime(timer)}s</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>• Make sure your microphone is working properly before starting</p>
        <p>• Speak clearly and loudly enough to be heard</p>
        <p>• You can replay your recording before submitting</p>
      </div>
    </div>
  );
};

export default SpeakingTestComponent;