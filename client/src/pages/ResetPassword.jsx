// import React, { useEffect, useState } from 'react';
// import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import SummaryApi from '../common/SummaryApi';
// import toast from 'react-hot-toast';
// import AxiosToastError from '../utils/AxiosToastError';
// import Axios from '../utils/Axios';

// const ResetPassword = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [data, setData] = useState({
//     email: '',
//     newPassword: '',
//     confirmPassword: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const validValue = Object.values(data).every((el) => el.trim() !== '');

//   useEffect(() => {
//     if (!location?.state?.data?.success) {
//       navigate('/');
//     }

//     if (location?.state?.email) {
//       setData((prev) => ({
//         ...prev,
//         email: location?.state?.email,
//       }));
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (data.newPassword !== data.confirmPassword) {
//       toast.error('New password and confirm password must be same.');
//       return;
//     }

//     try {
//       const response = await Axios({
//         ...SummaryApi.resetPassword,
//         data: data,
//       });

//       if (response.data.error) {
//         toast.error(response.data.message);
//       }

//       if (response.data.success) {
//         toast.success(response.data.message);
//         navigate('/login');
//         setData({
//           email: '',
//           newPassword: '',
//           confirmPassword: '',
//         });
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   return (
//     <section className="w-full px-4 py-10 bg-white text-gray-800 font-medium">
//       <div className="max-w-md mx-auto border border-gray-200 rounded-xl shadow-md p-8 bg-white">
//         <h2 className="text-lg font-semibold mb-4 text-center">Reset Password</h2>
//         <form className="grid gap-5" onSubmit={handleSubmit}>
//           {/* New Password */}
//           <div className="grid gap-1">
//             <label htmlFor="newPassword" className="text-sm font-semibold">
//               New Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 id="newPassword"
//                 name="newPassword"
//                 placeholder="Enter your new password"
//                 value={data.newPassword}
//                 onChange={handleChange}
//                 className="w-full p-2 pr-10 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
//                 style={{ fontSize: '0.875rem' }}
//                 required
//               />
//               <span
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
//               >
//                 {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
//               </span>
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div className="grid gap-1">
//             <label htmlFor="confirmPassword" className="text-sm font-semibold">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 placeholder="Enter your confirm password"
//                 value={data.confirmPassword}
//                 onChange={handleChange}
//                 className="w-full p-2 pr-10 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
//                 style={{ fontSize: '0.875rem' }}
//                 required
//               />
//               <span
//                 onClick={() => setShowConfirmPassword((prev) => !prev)}
//                 className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
//               >
//                 {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
//               </span>
//             </div>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={!validValue}
//             className={`px-4 py-2 rounded font-semibold text-white transition ${
//               validValue
//                 ? 'bg-green-600 hover:bg-green-700'
//                 : 'bg-gray-400 cursor-not-allowed'
//             }`}
//           >
//             Change Password
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm font-semibold text-gray-700">
//           Already have an account?{' '}
//           <Link to="/login" className="text-green-700 font-medium hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>

//       <style jsx>{`
//         input::placeholder {
//           font-size: 0.75rem;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default ResetPassword;

import React, { useEffect, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const checkStrength = (password) => {
    if (!password) return '';
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^]).{8,}$/;
    return strongRegex.test(password) ? 'Strong' : 'Weak';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      setPasswordStrength(checkStrength(value));
    }
  };

  const validValue = Object.values(data).every((el) => el.trim() !== '');

  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate('/');
    }

    if (location?.state?.email) {
      setData((prev) => ({ ...prev, email: location?.state?.email }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      toast.error('New password and confirm password must match.');
      return;
    }

    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^]).{8,}$/;
    if (!strongRegex.test(data.newPassword)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.');
      return;
    }

    try {
      const response = await Axios({ ...SummaryApi.resetPassword, data });
      if (response.data.error) {
        toast.error(response.data.message);
      } else if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
        setData({ email: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full px-4 py-10 bg-white text-gray-800 font-medium">
      <div className="max-w-md mx-auto border border-gray-200 rounded-xl shadow-md p-8 bg-white">
        <h2 className="text-lg font-semibold mb-4 text-center">Reset Password</h2>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="grid gap-1">
            <label htmlFor="newPassword" className="text-sm font-semibold">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                placeholder="Enter your new password"
                value={data.newPassword}
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

            <p className="text-sm text-gray-700 font-medium mt-1">
              Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.
            </p>

            {data.newPassword && (
              <p className="text-sm font-semibold mt-1">
                Strength:{' '}
                <span
                  className={passwordStrength === 'Strong' ? 'text-green-700' : 'text-red-600'}
                >
                  {passwordStrength}
                </span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="grid gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={data.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 pr-10 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
                style={{ fontSize: '0.875rem' }}
                required
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-500"
              >
                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!validValue}
            className={`px-4 py-2 rounded font-semibold text-white transition ${
              validValue
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Change Password
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-semibold text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-green-700 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;
