import React, { useState, useEffect, useRef } from 'react';

const WritingTestComponent = ({ question, onAnswerChange, answer, writingTask, writingTaskType }) => {
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

  const resetTimer = () => {
    stopTimer();
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const getTaskDetails = () => {
    if (writingTask === 1) {
      if (writingTaskType === 'academic-graph') {
        return {
          title: "Writing Task 1: Academic",
          description: "You should write a report describing the information shown in the graph/chart/table.",
          timeLimit: "20 minutes",
          minWords: 150,
          tips: [
            "Summarize the main features",
            "Make comparisons where relevant",
            "Include key data points",
            "Organize information logically"
          ]
        };
      } else if (writingTaskType === 'academic-process') {
        return {
          title: "Writing Task 1: Academic Process",
          description: "You should describe the process shown in the diagram.",
          timeLimit: "20 minutes",
          minWords: 150,
          tips: [
            "Describe each stage clearly",
            "Use sequencing language",
            "Include all key steps",
            "Maintain logical flow"
          ]
        };
      } else if (writingTaskType === 'academic-map') {
        return {
          title: "Writing Task 1: Academic Map",
          description: "You should describe the changes shown in the maps.",
          timeLimit: "20 minutes",
          minWords: 150,
          tips: [
            "Compare the maps",
            "Highlight key changes",
            "Use appropriate vocabulary",
            "Organize by time periods"
          ]
        };
      } else if (writingTaskType === 'general-letter') {
        return {
          title: "Writing Task 1: General Training",
          description: "You should write a letter responding to the given situation.",
          timeLimit: "20 minutes",
          minWords: 150,
          tips: [
            "Address all bullet points",
            "Use appropriate tone",
            "Include relevant details",
            "Maintain clear structure"
          ]
        };
      }
    } else if (writingTask === 2) {
      return {
        title: "Writing Task 2: Essay",
        description: "You should write an essay presenting a point of view, argument or solution to a problem.",
        timeLimit: "40 minutes",
        minWords: 250,
        tips: [
          "Present a clear position",
          "Support with relevant examples",
          "Address both sides if required",
          "Use formal academic language"
        ]
      };
    }
    
    // Default fallback
    return {
      title: "Writing Task",
      description: "Write your response to the given prompt.",
      timeLimit: "60 minutes",
      minWords: 150,
      tips: [
        "Plan before writing",
        "Use clear paragraphs",
        "Check grammar and spelling",
        "Stay on topic"
      ]
    };
  };

  const taskDetails = getTaskDetails();

  return (
    <div className="writing-test-component">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-lg font-medium text-gray-900">{taskDetails.title}</h3>
          <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-sm">
            Time: {taskDetails.timeLimit}
          </span>
          {writingTask && (
            <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-sm">
              Task {writingTask}
            </span>
          )}
        </div>
        <p className="text-gray-700 mb-4">{taskDetails.description}</p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium text-yellow-800">
              Minimum {taskDetails.minWords} words required
            </span>
          </div>
        </div>

        {question.media && question.mediaType === 'image' && (
          <div className="mb-4">
            <img 
              src={question.media} 
              alt="Writing task visual" 
              className="max-w-full h-auto rounded-lg border border-gray-200"
            />
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Words: <span className={`font-medium ${wordCount >= taskDetails.minWords ? 'text-green-600' : 'text-red-600'}`}>{wordCount}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              Characters: <span className="font-medium">{charCount}</span>
            </div>
            <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
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
            <button
              onClick={resetTimer}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="writing-answer" className="block text-sm font-medium text-gray-700">
              Your Answer
            </label>
            <div className={`text-sm font-medium ${wordCount >= taskDetails.minWords ? 'text-green-600' : 'text-red-600'}`}>
              {wordCount < taskDetails.minWords 
                ? `${taskDetails.minWords - wordCount} words needed` 
                : '✓ Word count met'}
            </div>
          </div>
          <textarea
            id="writing-answer"
            value={text}
            onChange={handleTextChange}
            placeholder="Start writing your response here..."
            rows={15}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium mb-1 text-gray-800">Writing Tips</div>
            <ul className="space-y-1">
              {taskDetails.tips.slice(0, 2).map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium mb-1 text-gray-800">Structure</div>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="text-blue-500 mr-1">•</span>
                Clear introduction
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-1">•</span>
                Well-developed body
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-1">•</span>
                Effective conclusion
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-3 rounded border border-gray-200">
            <div className="font-medium mb-1 text-gray-800">Checklist</div>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                Grammar & spelling
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                Coherence & cohesion
              </li>
              <li className="flex items-start">
                <span className="text-purple-500 mr-1">•</span>
                Task completion
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">IELTS Writing Band Descriptors:</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Task Achievement/Response:</strong> How well you address the task requirements</p>
          <p><strong>Coherence & Cohesion:</strong> How well your ideas are organized and connected</p>
          <p><strong>Lexical Resource:</strong> Range and accuracy of vocabulary used</p>
          <p><strong>Grammatical Range & Accuracy:</strong> Variety and correctness of grammar</p>
        </div>
      </div>
    </div>
  );
};

export default WritingTestComponent;