import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [data, setData] = useState({ email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validValue = Object.values(data).every((el) => el.trim() !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/verification-otp', { state: data });
        setData({ email: '' });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full bg-blue-50 flex items-center justify-center px-4 py-10 text-gray-800 font-medium">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-center">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="grid gap-5">
          {/* Email Field */}
          <div className="grid gap-1">
            <label htmlFor="email" className="text-sm font-semibold text-gray-800">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={data.email}
              onChange={handleChange}
              className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-600 placeholder-gray-500"
              style={{ fontSize: '0.875rem' }}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!validValue}
            className={`px-4 py-2 rounded font-semibold text-white transition ${
              validValue
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Send OTP
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-sm text-center font-semibold text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-green-700 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>

      {/* Scoped style for smaller placeholder */}
      <style jsx>{`
        input::placeholder {
          font-size: 0.75rem;
        }
      `}</style>
    </section>
  );
};

export default ForgotPassword;
