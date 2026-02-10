import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, testAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [tests, setTests] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentAttempts, setRecentAttempts] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Chart data preparation functions
  const getUserGrowthData = () => {
    // For demo purposes - in a real app, you'd get this from the backend
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const counts = [10, 25, 30, 45, 60, 75]; // Simulated user growth
    
    return {
      labels: months,
      datasets: [
        {
          label: 'New Users',
          data: counts,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.1
        }
      ]
    };
  };

  const getTestDistributionData = () => {
    const sections = ['Listening', 'Reading', 'Writing', 'Speaking'];
    const counts = tests.reduce((acc, test) => {
      acc[test.section] = (acc[test.section] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: sections,
      datasets: [
        {
          label: 'Tests by Section',
          data: sections.map(section => counts[section] || 0),
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const getAttemptDistributionData = () => {
    // Calculate average scores by section
    const sectionScores = {
      listening: [],
      reading: [],
      writing: [],
      speaking: []
    };

    recentAttempts.forEach(attempt => {
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
      } else {
        averages[section] = 0;
      }
    });

    return {
      labels: ['Listening', 'Reading', 'Writing', 'Speaking'],
      datasets: [
        {
          label: 'Average Score (%)',
          data: [
            averages.listening || 0,
            averages.reading || 0,
            averages.writing || 0,
            averages.speaking || 0
          ],
          backgroundColor: 'rgba(147, 51, 234, 0.5)',
          borderColor: 'rgb(147, 51, 234)',
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Title'
      }
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsResponse, testsResponse, usersResponse, attemptsResponse] = await Promise.all([
        userAPI.getUserStats(),
        testAPI.getAllTests(),
        userAPI.getAllUsers(),
        userAPI.getUserAttempts()
      ]);
      
      setStats(statsResponse.data.stats);
      setTests(testsResponse.data.tests);
      setRecentUsers(usersResponse.data.users.slice(0, 5));
      setRecentAttempts(attemptsResponse.data.attempts.slice(0, 5));
    } catch (error) {
      setError('Failed to load admin data');
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
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
          onClick={fetchAdminData}
          className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor system performance and manage content</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.usersWithAttempts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{tests?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h4a2 2 0 002-2v-8a2 2 0 00-2-2h-4a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalAttempts || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">User Growth</h2>
          <div className="h-64">
            <Line data={getUserGrowthData()} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: 'Monthly User Growth' }
              }
            }} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tests by Section</h2>
          <div className="h-64">
            <Pie data={getTestDistributionData()} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: 'Distribution of Tests by Section' }
              }
            }} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Average Scores by Section</h2>
          <div className="h-64">
            <Bar data={getAttemptDistributionData()} options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { display: true, text: 'Average Scores by Section' }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function(value) {
                      return value + '%';
                    }
                  }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Registrations</h2>
          <div className="space-y-4">
            {recentUsers.length > 0 ? (
              recentUsers.map(user => (
                <div key={user._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <img 
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}&background=3b82f6&color=fff`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent registrations</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Test Attempts</h2>
          <div className="space-y-4">
            {recentAttempts.length > 0 ? (
              recentAttempts.map(attempt => (
                <div key={attempt._id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-900">
                      {attempt.testId?.title || 'Unknown Test'}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      attempt.score >= 80 ? 'bg-green-100 text-green-800' :
                      attempt.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {attempt.score}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{attempt.userId?.name || 'Unknown User'}</span>
                    <span>{new Date(attempt.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent test attempts</p>
            )}
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Test Management</h2>
          <p className="text-gray-600 mb-4">Create, edit, and manage IELTS mock tests</p>
          <button 
            className="btn-primary w-full"
            onClick={() => navigate('/test-management')}
          >
            Manage Tests
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">View and manage user accounts and permissions</p>
          <button 
            className="btn-primary w-full"
            onClick={() => navigate('/user-management')}
          >
            Manage Users
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics</h2>
          <p className="text-gray-600 mb-4">View detailed statistics and performance reports</p>
          <button className="btn-primary w-full">
            View Analytics
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Settings</h2>
          <p className="text-gray-600 mb-4">Configure application settings and preferences</p>
          <button className="btn-primary w-full">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;