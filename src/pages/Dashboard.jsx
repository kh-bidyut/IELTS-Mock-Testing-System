import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import TestAttemptCard from '../components/TestAttemptCard';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const attemptsResponse = await userAPI.getMyAttempts();
      setAttempts(attemptsResponse.data.attempts);
      
      // Only fetch admin stats if user is admin
      if (isAdmin) {
        const statsResponse = await userAPI.getUserStats();
        setStats(statsResponse.data.stats);
      }
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSectionAverages = () => {
    if (attempts.length === 0) return null;

    const sectionScores = {
      listening: [],
      reading: [],
      writing: [],
      speaking: []
    };

    attempts.forEach(attempt => {
      if (attempt.sectionScores) {
        Object.keys(sectionScores).forEach(section => {
          if (attempt.sectionScores[section] !== undefined) {
            sectionScores[section].push(attempt.sectionScores[section]);
          }
        });
      }
    });

    const averages = {};
    Object.keys(sectionScores).forEach(section => {
      if (sectionScores[section].length > 0) {
        const sum = sectionScores[section].reduce((a, b) => a + b, 0);
        averages[section] = Math.round(sum / sectionScores[section].length);
      }
    });

    return averages;
  };

  const sectionAverages = calculateSectionAverages();

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
          onClick={fetchDashboardData}
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Track your IELTS preparation progress and continue improving your skills.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{attempts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h4a2 2 0 002-2v-8a2 2 0 00-2-2h-4a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {attempts.length > 0 
                  ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) 
                  : '0'}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Best Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {attempts.length > 0 
                  ? Math.max(...attempts.map(a => a.score)) 
                  : '0'}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Tests</p>
              <p className="text-2xl font-bold text-gray-900">
                {attempts.filter(a => {
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return new Date(a.date) > thirtyDaysAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Performance */}
      {sectionAverages && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Section Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(sectionAverages).map(([section, score]) => (
              <div key={section} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 capitalize mb-1">
                  {section}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {score}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Attempts */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Test Attempts</h2>
          <div className="flex space-x-3">
            <Link 
              to="/analytics" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h4a2 2 0 002-2v-8a2 2 0 00-2-2h-4a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              View Analytics
            </Link>
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse Tests
            </Link>
          </div>
        </div>

        {attempts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No test attempts yet</h3>
            <p className="text-gray-600 mb-6">
              Start your IELTS preparation by taking your first mock test.
            </p>
            <Link 
              to="/" 
              className="btn-primary inline-flex items-center"
            >
              Browse Tests
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {attempts.slice(0, 5).map(attempt => (
              <TestAttemptCard key={attempt._id} attempt={attempt} />
            ))}
          </div>
        )}
      </div>

      {/* Progress Overview */}
      {attempts.length > 1 && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Progress Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {attempts.length}
              </div>
              <div className="text-sm text-blue-600">Total Tests</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)}%
              </div>
              <div className="text-sm text-green-600">Overall Average</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">
                {attempts.length > 1 
                  ? Math.max(...attempts.map(a => a.score)) - Math.min(...attempts.map(a => a.score))
                  : 0}%
              </div>
              <div className="text-sm text-purple-600">Improvement</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/analytics" 
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md p-6 hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          <div className="flex items-center mb-3">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h4a2 2 0 002-2v-8a2 2 0 00-2-2h-4a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-bold">View Analytics</h3>
          </div>
          <p className="text-blue-100">Detailed insights into your performance</p>
        </Link>

        <Link 
          to="/" 
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md p-6 hover:from-green-600 hover:to-green-700 transition-all"
        >
          <div className="flex items-center mb-3">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-bold">Take Test</h3>
          </div>
          <p className="text-green-100">Continue your IELTS preparation</p>
        </Link>

        <Link 
          to="/profile" 
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-md p-6 hover:from-purple-600 hover:to-purple-700 transition-all"
        >
          <div className="flex items-center mb-3">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-lg font-bold">Profile</h3>
          </div>
          <p className="text-purple-100">Update your profile and settings</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;