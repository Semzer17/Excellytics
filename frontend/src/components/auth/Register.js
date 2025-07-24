import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', firstName: '', lastName: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="username" type="text" placeholder="Username" onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" />
          <input name="password" type="password" placeholder="Password (min. 6 characters)" onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" />
          <input name="firstName" type="text" placeholder="First Name" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" />
          <input name="lastName" type="text" placeholder="Last Name" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" />
          <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-bold transition-colors duration-300 disabled:bg-blue-300">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;