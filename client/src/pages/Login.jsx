import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import logo from '../assets/taja.png';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = e => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const validValue = Object.values(data).every(el => el.trim() !== '');

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await Axios({ ...SummaryApi.login, data });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('accesstoken', response.data.data.accesstoken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));

        setData({ email: '', password: '' });
        navigate('/');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full px-4 py-10 bg-white font-sans">
      <div className="max-w-md mx-auto border rounded-lg shadow-md p-8 bg-white">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16" />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-semibold text-gray-800 text-sm">
              Email Address*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              value={data.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-50 placeholder-gray-600 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
              autoFocus
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 font-semibold text-gray-800 text-sm">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your Password"
                value={data.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded bg-gray-50 placeholder-gray-600 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <span
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
            <Link
              to="/forgot-password"
              className="block text-right text-sm mt-1 text-gray-600 hover:text-green-700 font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!validValue}
            className={`w-full py-2 rounded font-semibold text-white transition-all ${
              validValue ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Login
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-4 text-center text-sm font-semibold text-gray-700">
          Don’t Have an Account?{' '}
          <Link to="/register" className="text-green-700 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
