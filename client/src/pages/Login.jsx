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
import logo from '../assets/herbolic.png';

const Login = () => {
  const [data, setData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaStep, setMfaStep] = useState(false); // Track MFA state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const validValue = Object.values(data).every((el) => el.trim() !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({ ...SummaryApi.login, data });

      if (response.data.error) {
        toast.error(response.data.message);
        return;
      }

      if (response.data.mfaRequired) {
        toast.success("OTP sent to your email");
        setMfaStep(true);
        return;
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

  const handleOtpVerify = async () => {
    try {
      const response = await Axios.post('/api/user/verify-mfa', {
        email: data.email,
        otp
      }, { withCredentials: true });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('accesstoken', response.data.data.accesstoken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));

        navigate('/');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full px-4 py-10 bg-white text-gray-800 font-medium">
      <div className="max-w-md mx-auto border border-gray-200 rounded-xl shadow-md p-8 bg-white">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Herbolic Logo" className="h-16 scale-110" />
        </div>

        {/* Login or OTP Form */}
        <form className="grid gap-5" onSubmit={mfaStep ? e => e.preventDefault() : handleSubmit}>
          
          {/* Email (Always show) */}
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-semibold">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleChange}
              className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
              style={{ fontSize: '0.875rem' }}
              required
              disabled={mfaStep} // lock input if OTP step
            />
          </div>

          {/* Password (only show if not in OTP step) */}
          {!mfaStep && (
            <div className="grid gap-1">
              <label htmlFor="password" className="text-sm font-semibold">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={handleChange}
                  className="w-full p-2 pr-10 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
                  style={{ fontSize: '0.875rem' }}
                  required
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </span>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-right mt-1 text-gray-600 hover:text-green-700 font-semibold"
              >
                Forgot Password?
              </Link>
            </div>
          )}

          {/* OTP Input (only in OTP step) */}
          {mfaStep && (
            <div className="grid gap-1">
              <label htmlFor="otp" className="text-sm font-semibold">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter the 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
                maxLength={6}
                style={{ fontSize: '0.875rem' }}
                required
              />
              <button
                type="button"
                onClick={handleOtpVerify}
                className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
              >
                Verify OTP
              </button>
            </div>
          )}

          {/* Login Button */}
          {!mfaStep && (
            <button
              type="submit"
              disabled={!validValue}
              className={`px-4 py-2 rounded font-semibold text-white transition ${
                validValue
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Login
            </button>
          )}
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm font-semibold text-gray-700">
          Don’t have an account?{' '}
          <Link to="/register" className="text-green-700 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>

      <style jsx>{`
        input::placeholder {
          font-size: 0.75rem;
        }
      `}</style>
    </section>
  );
};

export default Login;
