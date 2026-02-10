import React, { useState, useEffect, useRef } from 'react';

const ListeningTestComponent = ({ question, onAnswerChange, answer, audioUrl }) => {
  const [userAnswer, setUserAnswer] = useState(answer || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (answer) {
      setUserAnswer(answer);
    }
  }, [answer]);

  useEffect(() => {
    onAnswerChange(userAnswer);
  }, [userAnswer, onAnswerChange]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleAnswerChange = (value) => {
    setUserAnswer(value);
  };

  const renderQuestion = () => {
    const questionType = question.listeningQuestionType || 'multiple-choice';

    switch (questionType) {
      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label 
                key={index}
                className={`option-radio ${userAnswer === option ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'short-answer':
        return (
          <div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type what you hear..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={question.maxAnswerLength || 100}
            />
            <p className="text-sm text-gray-500 mt-1">
              Maximum {question.maxAnswerLength || 100} characters
            </p>
          </div>
        );

      case 'sentence-completion':
        return (
          <div>
            <p className="text-gray-700 mb-3">{question.questionText}</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Complete what you heard..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'form-completion':
        return (
          <div>
            <p className="text-gray-700 mb-3">{question.questionText}</p>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Fill in the form field..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <label 
                key={index}
                className={`option-radio ${userAnswer === option ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="mr-3"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="listening-test-component">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Listening Question</h3>
        
        {audioUrl && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-800 mb-3">Audio Track</h4>
            
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={handlePlayPause}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Play
                  </>
                )}
              </button>
              
              <div className="flex-1">
                <div 
                  className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 mb-4">{question.questionText}</p>
          
          {renderQuestion()}
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">Listening Tips:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Listen carefully to the instructions before the recording starts</li>
          <li>• Read the questions while you have time</li>
          <li>• Predict the type of information you need to listen for</li>
          <li>• Don't panic if you miss one answer - continue listening</li>
          <li>• Remember to transfer your answers to the answer sheet</li>
        </ul>
      </div>
    </div>
  );
};

export default ListeningTestComponent;