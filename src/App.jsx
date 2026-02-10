import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TestPage from './pages/TestPage'
import ResultPage from './pages/ResultPage'
import AdminDashboard from './pages/AdminDashboard'
import TestManagement from './pages/TestManagement'
import UserManagement from './pages/UserManagement'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'
import DatabaseDashboard from './pages/DatabaseDashboard'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/database" element={<ProtectedRoute><DatabaseDashboard /></ProtectedRoute>} />
              <Route path="/test/:id" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
              <Route path="/result/:id" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/test-management" element={<ProtectedRoute adminOnly><TestManagement /></ProtectedRoute>} />
              <Route path="/user-management" element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App