import React, { useState, useEffect } from 'react';

const WritingTestComponent = ({ question, onAnswerChange, answer }) => {
  const [text, setText] = useState(answer || '');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Initialize with any existing answer
    if (answer) {
      setText(answer);
    }
  }, [answer]);

  useEffect(() => {
    // Update word and character count whenever text changes
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(text.length);
    
    // Notify parent of changes
    onAnswerChange(text);
  }, [text, onAnswerChange]);

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

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="writing-test-component">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Writing Question</h3>
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div>Words: <span className="font-medium">{wordCount}</span></div>
            <div>Characters: <span className="font-medium">{charCount}</span></div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Time: {formatTime(timer)}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={startTimer}
              disabled={isTimerRunning}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Timer
            </button>
            <button
              onClick={stopTimer}
              disabled={!isTimerRunning}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stop Timer
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="writing-answer" className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer
          </label>
          <textarea
            id="writing-answer"
            value={text}
            onChange={handleTextChange}
            placeholder="Start writing your response here..."
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium mb-1">Tips for Writing</div>
            <ul className="space-y-1">
              <li>• Organize your thoughts before writing</li>
              <li>• Use clear topic sentences</li>
            </ul>
          </div>
          
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium mb-1">Structure</div>
            <ul className="space-y-1">
              <li>• Introduction with thesis</li>
              <li>• Body paragraphs with examples</li>
            </ul>
          </div>
          
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium mb-1">Review Checklist</div>
            <ul className="space-y-1">
              <li>• Check grammar and spelling</li>
              <li>• Ensure coherence and cohesion</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>• Aim for at least 250 words for Task 2 and 150 words for Task 1</p>
        <p>• Use formal academic language</p>
        <p>• Proofread your response before submitting</p>
      </div>
    </div>
  );
};

export default WritingTestComponent;