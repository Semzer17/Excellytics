import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  BarChart3, 
  Upload, 
  FileText, 
  TrendingUp, 
  Users, 
  Shield,
  ChevronRight,
  Download,
  Zap
} from 'lucide-react';

const LandingPage = () => {
  const { user, loading } = useAuth();

  const features = [
    {
      icon: Upload,
      title: 'Easy File Upload',
      description: 'Upload Excel files (.xls, .xlsx) with drag & drop or click to browse. Support for large files up to 10MB.'
    },
    {
      icon: BarChart3,
      title: 'Interactive Charts',
      description: 'Generate beautiful 2D and 3D charts including bar, line, pie, scatter plots and more with just a few clicks.'
    },
    {
      icon: TrendingUp,
      title: 'Data Analysis',
      description: 'Automatically analyze your data types, get insights, and create meaningful visualizations from your Excel data.'
    },
    {
      icon: Download,
      title: 'Export Options',
      description: 'Download your charts as PNG/PDF files and save your analysis history for future reference.'
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Secure user authentication with JWT, personal dashboards, and upload history tracking.'
    },
    {
      icon: Shield,
      title: 'Admin Panel',
      description: 'Comprehensive admin dashboard to manage users, monitor data usage, and system analytics.'
    }
  ];
  
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  if (user) {
      return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Excellytics
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Excel Data
              </span>
              <br />
              Into Beautiful Charts
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Upload Excel files, analyze data automatically, and create stunning interactive 2D & 3D visualizations. 
              Built with the MERN stack for powerful data analytics and seamless user experience.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Zap className="h-5 w-5" />
                  <span>Start Analyzing Now</span>
                </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                  <Upload className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">1. Upload Excel</h3>
                  <p className="text-sm text-gray-600">Drag and drop your .xlsx or .xls files securely.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">2. Build Charts</h3>
                  <p className="text-sm text-gray-600">Select your data and choose from various chart types.</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                  <Download className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">3. Gain Insights</h3>
                  <p className="text-sm text-gray-600">Analyze trends and export your findings as PNG or PDF.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need for Data Analysis</h2>
            <p className="mt-4 text-lg text-gray-600">A powerful suite of tools to bring your data to life.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="p-6 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-lg hover:bg-white">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            <span className="block">Ready to dive in?</span>
            <span className="block text-blue-600">Start analyzing your data today.</span>
          </h2>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Excellytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;