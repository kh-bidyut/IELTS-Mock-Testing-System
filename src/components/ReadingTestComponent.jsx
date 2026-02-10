import React, { useState, useEffect } from 'react';

const ReadingTestComponent = ({ question, onAnswerChange, answer, passage }) => {
  const [userAnswer, setUserAnswer] = useState(answer || '');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    if (answer) {
      setUserAnswer(answer);
    }
  }, [answer]);

  useEffect(() => {
    onAnswerChange(userAnswer);
  }, [userAnswer, onAnswerChange]);

  const handleAnswerChange = (value) => {
    setUserAnswer(value);
  };

  const renderQuestion = () => {
    const questionType = question.readingQuestionType || 'multiple-choice';

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

      case 'true-false-not-given':
      case 'yes-no-not-given':
        return (
          <div className="space-y-2">
            {['True', 'False', 'Not Given'].map((option, index) => (
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
              placeholder="Type your answer here..."
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
              placeholder="Complete the sentence..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'gap-fill':
        return (
          <div className="space-y-2">
            {question.gapFillOptions && question.gapFillOptions.length > 0 ? (
              <select
                value={userAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select an option</option>
                {question.gapFillOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Fill in the gap..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
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
    <div className="reading-test-component">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Reading Question</h3>
        
        {passage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-800 mb-2">{passage.title}</h4>
            <div className="text-sm text-blue-700 mb-2">
              <span className="mr-4">Words: {passage.wordCount}</span>
              <span>Estimated time: {passage.estimatedReadingTime} min</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{passage.content}</p>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 mb-4">{question.questionText}</p>
          
          {renderQuestion()}
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">Reading Tips:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Read the passage thoroughly before answering questions</li>
          <li>• Identify key words and phrases in both passage and questions</li>
          <li>• For True/False/Not Given, distinguish between what is stated and what is implied</li>
          <li>• Manage your time - aim for 1-2 minutes per question</li>
        </ul>
      </div>
    </div>
  );
};

export default ReadingTestComponent;