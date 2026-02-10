import React from 'react';
import { Link } from 'react-router-dom';

const TestCard = ({ test }) => {
  const getSectionColor = (section) => {
    const colors = {
      'Listening': 'bg-green-100 text-green-800',
      'Reading': 'bg-blue-100 text-blue-800',
      'Writing': 'bg-purple-100 text-purple-800',
      'Speaking': 'bg-orange-100 text-orange-800'
    };
    return colors[section] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-gray-100 text-gray-800',
      'Intermediate': 'bg-yellow-100 text-yellow-800',
      'Advanced': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className={`section-badge ${getSectionColor(test.section)}`}>
            {test.section}
          </span>
          <span className={`difficulty-badge ${getDifficultyColor(test.difficulty)}`}>
            {test.difficulty}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {test.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {test.description || 'No description available for this test.'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(test.timeLimit)}
          </div>
          
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {test.questions?.length || 0} questions
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">
            Created by {test.createdBy?.name || 'Unknown'}
          </div>
          <Link
            to={`/test/${test._id}`}
            className="btn-primary text-sm py-2 px-4"
          >
            Start Test
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestCard;