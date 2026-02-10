import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SpeakingTestComponent from '../components/SpeakingTestComponent';
import WritingTestComponent from '../components/WritingTestComponent';

const TestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [id]);

  useEffect(() => {
    if (test && test.timeLimit) {
      setTimeLeft(test.timeLimit * 60); // Convert minutes to seconds
    }
  }, [test]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && test) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft, test]);

  const fetchTest = async () => {
    try {
      setLoading(true);
      const response = await testAPI.getTestById(id);
      setTest(response.data.test);
    } catch (error) {
      setError('Failed to load test');
      console.error('Error fetching test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!test) return;

    // Check if all questions are answered
    const answeredCount = Object.keys(answers).length;
    const totalQuestions = test.questions.length;

    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have only answered ${answeredCount} out of ${totalQuestions} questions. Do you want to submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    try {
      // Convert answers object to array in question order
      const answersArray = test.questions.map((_, index) => answers[index] || '');
      
      const response = await testAPI.submitTest(id, answersArray);
      const attemptId = response.data.attemptId || 'temp';
      
      // Navigate to results page
      navigate(`/result/${attemptId}`, { 
        state: { 
          results: response.data,
          testTitle: test.title
        } 
      });
    } catch (error) {
      setError('Failed to submit test');
      console.error('Error submitting test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchTest}
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Test not found</h2>
        <p className="text-gray-600">The test you're looking for doesn't exist or is no longer available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Test Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{test.title}</h1>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {test.section}
              </span>
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                {test.difficulty}
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {test.timeLimit} minutes
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {test.questions.length} questions
              </span>
            </div>
          </div>
          
          {/* Timer */}
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-semibold">
            <div className="text-sm">Time Remaining</div>
            <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
          </div>
        </div>
        
        {test.description && (
          <p className="text-gray-700 mb-4">{test.description}</p>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Answer all questions to the best of your ability</li>
            <li>• You can change your answers at any time before submitting</li>
            <li>• The test will auto-submit when time runs out</li>
            <li>• Your results will be available immediately after submission</li>
          </ul>
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Questions</h2>
        
        <div className="space-y-8">
          {test.questions.map((question, index) => (
            <div key={index} className="question-container">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="bg-gray-200 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-3">
                    Question {index + 1}
                  </span>
                  {question.media && (
                    <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {question.mediaType}
                    </span>
                  )}
                </div>
                
                <p className="text-lg font-medium text-gray-900 mb-4">
                  {question.questionText}
                </p>
                
                {question.media && question.mediaType === 'image' && (
                  <div className="mb-4">
                    <img 
                      src={question.media} 
                      alt="Question media" 
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                
                {question.media && question.mediaType === 'audio' && (
                  <div className="mb-4">
                    <audio controls className="w-full">
                      <source src={question.media} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </div>
              
              {question.questionType === 'speaking' ? (
                // Speaking question with IELTS parts
                <SpeakingTestComponent
                  question={question}
                  onAnswerChange={(answer) => handleAnswerChange(index, answer)}
                  answer={answers[index]}
                  speakingPart={question.speakingPart}
                />
              ) : question.questionType === 'writing-task1' || question.questionType === 'writing-task2' ? (
                // Writing questions with IELTS task types
                <WritingTestComponent
                  question={question}
                  onAnswerChange={(answer) => handleAnswerChange(index, answer)}
                  answer={answers[index]}
                  writingTask={question.questionType === 'writing-task1' ? 1 : 2}
                  writingTaskType={question.writingTaskType}
                />
              ) : question.options && question.options.length > 0 ? (
                // Multiple choice question
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label 
                      key={optionIndex}
                      className={`option-radio ${answers[index] === option ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() => handleAnswerChange(index, option)}
                        className="mr-3"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                // Text input question (Writing section)
                <div>
                  <textarea
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            Answered: {Object.keys(answers).length} / {test.questions.length} questions
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              'Submit Test'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;