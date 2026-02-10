import React, { useState, useEffect } from 'react';
import { testAPI, userAPI, analyticsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DatabaseDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    tests: [],
    users: [],
    analytics: null,
    stats: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all data in parallel
      const [testsResponse, usersResponse, analyticsResponse, statsResponse] = await Promise.allSettled([
        testAPI.getAllTests({ limit: 20 }), // Get first 20 tests
        userAPI.getAllUsers({ limit: 10 }), // Get first 10 users
        analyticsAPI.getUserStats(),
        userAPI.getUserStats()
      ]);

      const testData = testsResponse.status === 'fulfilled' ? testsResponse.value.data : { tests: [], pagination: {} };
      const userData = usersResponse.status === 'fulfilled' ? usersResponse.value.data : { users: [], pagination: {} };
      const analyticsData = analyticsResponse.status === 'fulfilled' ? analyticsResponse.value.data : null;
      const statsData = statsResponse.status === 'fulfilled' ? statsResponse.value.data : null;

      setDashboardData({
        tests: testData.tests || [],
        users: userData.users || [],
        analytics: analyticsData,
        stats: statsData,
        testPagination: testData.pagination,
        userPagination: userData.pagination
      });
    } catch (error) {
      setError('Failed to load dashboard data: ' + (error.message || 'Unknown error'));
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getSectionColor = (section) => {
    const colors = {
      'Listening': 'bg-green-100 text-green-800 border-green-200',
      'Reading': 'bg-blue-100 text-blue-800 border-blue-200',
      'Writing': 'bg-purple-100 text-purple-800 border-purple-200',
      'Speaking': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[section] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Beginner': 'bg-gray-100 text-gray-800 border-gray-200',
      'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Advanced': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading database dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto mt-12">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-700 mb-6">{error}</p>
        <button 
          onClick={fetchAllData}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Database Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Comprehensive overview of all data in the IELTS Mock Testing System
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'tests', label: 'Tests', icon: '📝' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'analytics', label: 'Analytics', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Tests</p>
                  <p className="text-3xl font-bold mt-1">
                    {dashboardData.testPagination?.totalItems || dashboardData.tests.length}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-blue-100 text-xs mt-3">
                {dashboardData.testPagination?.totalPages || 1} pages available
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Users</p>
                  <p className="text-3xl font-bold mt-1">
                    {dashboardData.stats?.stats?.totalUsers || dashboardData.users.length}
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-green-100 text-xs mt-3">
                {dashboardData.stats?.stats?.adminUsers || 0} admins
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg. Score</p>
                  <p className="text-3xl font-bold mt-1">
                    {dashboardData.analytics?.stats?.averageScore || 0}%
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h4a2 2 0 002-2v-8a2 2 0 00-2-2h-4a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-purple-100 text-xs mt-3">
                Performance analytics
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Completion</p>
                  <p className="text-3xl font-bold mt-1">
                    {dashboardData.analytics?.stats?.completionRate || 0}%
                  </p>
                </div>
                <div className="bg-white bg-opacity-20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-orange-100 text-xs mt-3">
                  Test completion rate
              </p>
            </div>
          </div>

          {/* Recent Data Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tests */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <span className="mr-2">📝</span>
                  Recent Tests
                </h3>
              </div>
              <div className="p-6">
                {dashboardData.tests.slice(0, 5).map(test => (
                  <div key={test._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {test.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {test.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSectionColor(test.section)}`}>
                        {test.section}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-4 text-blue-600 hover:text-blue-800 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  View All Tests
                </button>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <span className="mr-2">👥</span>
                  Recent Users
                </h3>
              </div>
              <div className="p-6">
                {dashboardData.users.slice(0, 5).map(user => (
                  <div key={user._id} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                    <img
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))}
                <button className="w-full mt-4 text-blue-600 hover:text-blue-800 font-medium py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  View All Users
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tests Tab */}
      {activeTab === 'tests' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">All Tests Database</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {dashboardData.tests.length} of {dashboardData.testPagination?.totalItems || 0} tests
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.tests.map(test => (
                  <tr key={test._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{test.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{test.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSectionColor(test.section)}`}>
                        {test.section}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {test.questions?.length || 0} questions
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {test.timeLimit} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        test.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {test.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {dashboardData.testPagination && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {dashboardData.testPagination.currentPage} of {dashboardData.testPagination.totalPages}
              </div>
              <div className="flex space-x-2">
                <button 
                  disabled={!dashboardData.testPagination.hasPrevPage}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button 
                  disabled={!dashboardData.testPagination.hasNextPage}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Users Database</h3>
            <p className="text-sm text-gray-600 mt-1">
              Showing {dashboardData.users.length} users
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests Taken</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.testAttempts?.length || 0} tests
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Score</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {dashboardData.analytics?.stats?.averageScore || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="text-2xl font-bold text-green-600">
                    {dashboardData.analytics?.stats?.completionRate || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Attempts</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {dashboardData.analytics?.stats?.totalAttempts || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">User Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Users</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {dashboardData.stats?.stats?.totalUsers || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Admin Users</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {dashboardData.stats?.stats?.adminUsers || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recent Registrations</span>
                  <span className="text-2xl font-bold text-green-600">
                    {dashboardData.stats?.stats?.recentRegistrations || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Section Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['listening', 'reading', 'writing', 'speaking'].map(section => (
                <div key={section} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-800 capitalize">
                    {section}
                  </div>
                  <div className="text-3xl font-bold text-blue-600 my-2">
                    {dashboardData.analytics?.sectionPerformance?.[section]?.average || 0}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {dashboardData.analytics?.sectionPerformance?.[section]?.count || 0} attempts
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseDashboard;