import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import FileUpload from './components/files/FileUpload';
import FileList from './components/files/FileList';
import FileViewer from './components/files/FileViewer';
import ChartBuilder from './components/charts/ChartBuilder';
import AdminPanel from './components/admin/AdminPanel';
import Profile from './components/profile/Profile';
import LandingPage from './components/LandingPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }
  
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-100">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Navbar />
                <main className="container mx-auto p-4"><Dashboard /></main>
              </ProtectedRoute>
            } />
            
            <Route path="/upload" element={
              <ProtectedRoute>
                <Navbar />
                <main className="container mx-auto p-4"><FileUpload /></main>
              </ProtectedRoute>
            } />
            
            <Route path="/files" element={
              <ProtectedRoute>
                <Navbar />
                <main className="container mx-auto p-4"><FileList /></main>
              </ProtectedRoute>
            } />
            
            <Route path="/files/:id" element={
              <ProtectedRoute>
                <Navbar />
                <main className="container mx-auto p-4"><FileViewer /></main>
              </ProtectedRoute>
            } />
            
            <Route path="/files/:id/chart" element={
              <ProtectedRoute>
                <Navbar />
                <main className="container mx-auto p-4"><ChartBuilder /></main>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Navbar />
                <main className="container mx-auto p-4"><Profile /></main>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <Navbar />
                <main className="container mx-auto p-4"><AdminPanel /></main>
              </AdminRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;