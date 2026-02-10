import React, { useState, useRef, useEffect } from 'react';

const SpeakingTestComponent = ({ question, onAnswerChange, answer, speakingPart }) => {
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(answer || null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [preparationTime, setPreparationTime] = useState(speakingPart === 2 ? 60 : 0); // 1 minute prep for Part 2
  const [isPreparationRunning, setIsPreparationRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('instructions'); // instructions, preparation, recording
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const prepTimerRef = useRef(null);

  useEffect(() => {
    // Initialize with any existing answer
    if (answer) {
      setRecordedAudio(answer);
    }
  }, [answer]);

  const startPreparation = () => {
    if (speakingPart === 2) {
      setCurrentPhase('preparation');
      setIsPreparationRunning(true);
      prepTimerRef.current = setInterval(() => {
        setPreparationTime(prev => {
          if (prev <= 1) {
            clearInterval(prepTimerRef.current);
            setIsPreparationRunning(false);
            startRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      startRecording();
    }
  };

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
        setRecording(false);
        stopTimer();
        setCurrentPhase('completed');
      };

      mediaRecorderRef.current.start();
      setRecording(true);
      setCurrentPhase('recording');
      startTimer();

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        // Auto-stop based on IELTS speaking part timing
        const timeLimits = {
          1: 300, // 5 minutes for Part 1
          2: 120, // 2 minutes for Part 2
          3: 300  // 5 minutes for Part 3
        };
        const limit = timeLimits[speakingPart] || 300;
        
        if (prev >= limit) {
          stopRecording();
          return limit;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsTimerRunning(false);
    }
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      setIsPreparationRunning(false);
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

  const resetTest = () => {
    setRecordedAudio(null);
    setTimer(0);
    setPreparationTime(speakingPart === 2 ? 60 : 0);
    setCurrentPhase('instructions');
    onAnswerChange('');
    stopTimer();
  };

  const getPartInstructions = () => {
    switch(speakingPart) {
      case 1:
        return {
          title: "Part 1: Introduction and Interview",
          timeLimit: "4-5 minutes",
          description: "Answer questions about familiar topics like your home, family, work, studies, and interests."
        };
      case 2:
        return {
          title: "Part 2: Individual Long Turn",
          timeLimit: "3-4 minutes",
          description: "You'll have 1 minute to prepare, then speak for 1-2 minutes on a given topic."
        };
      case 3:
        return {
          title: "Part 3: Two-way Discussion",
          timeLimit: "4-5 minutes",
          description: "Discuss more abstract ideas and opinions related to the Part 2 topic."
        };
      default:
        return {
          title: "Speaking Test",
          timeLimit: "Varies",
          description: "Speak clearly and naturally about the given topic."
        };
    }
  };

  const instructions = getPartInstructions();

  return (
    <div className="speaking-test-component">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{instructions.title}</h3>
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-sm">
            Time: {instructions.timeLimit}
          </span>
          {speakingPart && (
            <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-sm">
              Part {speakingPart}
            </span>
          )}
        </div>
        <p className="text-gray-700 mb-4">{instructions.description}</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-blue-800 mb-2">Question:</h4>
          <p className="text-blue-700">{question.questionText}</p>
        </div>

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
        {/* Instructions Phase */}
        {currentPhase === 'instructions' && (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to begin?</h3>
              <p className="text-gray-600">
                {speakingPart === 2 
                  ? "You'll have 1 minute to prepare, then record your response."
                  : "Click start to begin recording your response."
                }
              </p>
            </div>
            <button
              onClick={startPreparation}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {speakingPart === 2 ? "Start Preparation" : "Start Recording"}
            </button>
          </div>
        )}

        {/* Preparation Phase (Part 2 only) */}
        {currentPhase === 'preparation' && speakingPart === 2 && (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-orange-600 mb-2">Preparation Time</h3>
              <div className="text-4xl font-bold text-orange-600 mb-4">
                {formatTime(preparationTime)}
              </div>
              <p className="text-gray-600">Prepare your thoughts on the topic</p>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <p className="text-gray-700 font-medium">Topic: {question.questionText}</p>
            </div>
          </div>
        )}

        {/* Recording Phase */}
        {currentPhase === 'recording' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg font-semibold">
                  <div className="text-sm">Recording Time</div>
                  <div className="text-xl">{formatTime(timer)}</div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-red-600 font-medium">Recording in progress...</span>
                </div>
              </div>

              <button
                onClick={stopRecording}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop Recording
              </button>
            </div>
          </div>
        )}

        {/* Completed Phase */}
        {currentPhase === 'completed' && recordedAudio && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-semibold">
                  <div className="text-sm">Recording Complete</div>
                  <div className="text-xl">{formatTime(timer)}</div>
                </div>
                
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
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={resetTest}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded border border-gray-200">
              <div className="text-sm text-gray-600">
                <p>• Your response has been recorded successfully</p>
                <p>• You can listen to your recording before submitting</p>
                <p>• Make sure you've answered the question appropriately</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="text-sm text-gray-600 mb-4">
          <p><strong>IELTS Speaking Tips:</strong></p>
        </div>
        <ul className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2">
          <li>• Speak naturally and fluently</li>
          <li>• Answer directly with supporting details</li>
          <li>• Show strong grammatical range</li>
          <li>• Use appropriate vocabulary</li>
          <li>• Maintain clear pronunciation</li>
          <li>• Keep to the time limits</li>
        </ul>
      </div>
    </div>
  );
};

export default SpeakingTestComponent;