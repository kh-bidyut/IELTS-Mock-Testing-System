import React from 'react';
import { Link } from 'react-router-dom';

const TestAttemptCard = ({ attempt }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSectionColor = (section) => {
    const colors = {
      'Listening': 'bg-green-100 text-green-800',
      'Reading': 'bg-blue-100 text-blue-800',
      'Writing': 'bg-purple-100 text-purple-800',
      'Speaking': 'bg-orange-100 text-orange-800'
    };
    return colors[section] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`section-badge ${getSectionColor(attempt.testId?.section || 'Unknown')}`}>
              {attempt.testId?.section || 'Unknown'}
            </span>
            <h3 className="font-semibold text-gray-900">
              {attempt.testId?.title || 'Unknown Test'}
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(attempt.date)}
            </div>
            
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {attempt.testId?.difficulty || 'Unknown'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full font-semibold ${getScoreColor(attempt.score)}`}>
            {attempt.score}%
          </div>
          
          <Link
            to={`/result/${attempt._id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
      
      {/* Section Scores (if available) */}
      {attempt.sectionScores && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-3">
            {Object.entries(attempt.sectionScores).map(([section, score]) => (
              score !== undefined && (
                <div key={section} className="text-xs">
                  <span className="text-gray-600 capitalize">{section}:</span>
                  <span className={`ml-1 font-medium ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAttemptCard;