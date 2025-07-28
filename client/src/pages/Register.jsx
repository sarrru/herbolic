
// import React, { useState } from 'react';
// import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa6';
// import toast from 'react-hot-toast';
// import Axios from '../utils/Axios';
// import SummaryApi from '../common/SummaryApi';
// import AxiosToastError from '../utils/AxiosToastError';
// import { Link, useNavigate } from 'react-router-dom';
// import logo from '../assets/herbolic.png';

// const Register = () => {
//   const [data, setData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState('');
//   const navigate = useNavigate();

//   const checkStrength = (password) => {
//     if (!password) return '';
//     const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^]).{8,}$/;
//     return strongRegex.test(password) ? 'Strong' : 'Weak';
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({ ...prev, [name]: value }));
//     if (name === 'password') {
//       setPasswordStrength(checkStrength(value));
//     }
//   };

//   const validValue = Object.values(data).every((el) => el.trim() !== '');

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (data.password !== data.confirmPassword) {
//       toast.error('Password and Confirm Password must match');
//       return;
//     }

//     const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^]).{8,}$/;
//     if (!strongRegex.test(data.password)) {
//       toast.error(
//         'Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.'
//       );
//       return;
//     }

//     try {
//       const response = await Axios({ ...SummaryApi.register, data });
//       if (response.data.error) {
//         toast.error(response.data.message);
//       } else if (response.data.success) {
//         toast.success(response.data.message);
//         setData({ name: '', email: '', password: '', confirmPassword: '' });
//         navigate('/login');
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   return (
//     <section className="w-full px-4 py-10 bg-white text-gray-800 font-medium">
//       <div className="max-w-xl mx-auto border border-gray-200 rounded-xl shadow-md p-8 bg-white">

//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <img src={logo} alt="Logo" className="h-16" />
//         </div>

//         {/* Registration Form */}
//         <form className="grid gap-5" onSubmit={handleSubmit}>
//           {/* Name */}
//           <div className="grid gap-1">
//             <label htmlFor="name" className="text-sm font-semibold">Full Name</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               placeholder="Enter your full name"
//               value={data.name}
//               onChange={handleChange}
//               className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
//               style={{ fontSize: '0.875rem' }}
//               autoFocus
//               required
//             />
//           </div>

//           {/* Email */}
//           <div className="grid gap-1">
//             <label htmlFor="email" className="text-sm font-semibold">Email Address</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder="Enter your email"
//               value={data.email}
//               onChange={handleChange}
//               className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
//               style={{ fontSize: '0.875rem' }}
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="grid gap-1">
//             <label htmlFor="password" className="text-sm font-semibold">Password</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 name="password"
//                 placeholder="Enter your password"
//                 value={data.password}
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

//             <p className="text-sm text-gray-700 font-medium mt-1">
//               Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.
//             </p>

//             {data.password && (
//               <p className="text-sm font-semibold mt-1">
//                 Strength:{' '}
//                 <span
//                   className={passwordStrength === 'Strong' ? 'text-green-700' : 'text-red-600'}
//                 >
//                   {passwordStrength}
//                 </span>
//               </p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div className="grid gap-1">
//             <label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 placeholder="Re-enter your password"
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

//           {/* Submit Button & Redirect */}
//           <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
//             <button
//               type="submit"
//               disabled={!validValue}
//               className={`px-6 py-2 rounded text-white font-semibold transition ${
//                 validValue
//                   ? 'bg-green-600 hover:bg-green-700'
//                   : 'bg-gray-400 cursor-not-allowed'
//               }`}
//             >
//               Signup
//             </button>
//             <p className="text-sm text-gray-700">
//               Already have an account?{' '}
//               <Link to="/login" className="text-green-700 font-medium hover:underline">
//                 Login
//               </Link>
//             </p>
//           </div>
//         </form>
//       </div>

//       {/* Scoped style for placeholder font size */}
//       <style jsx>{`
//         input::placeholder {
//           font-size: 0.75rem;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default Register;


import React, { useState, useRef } from 'react';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/herbolic.png';
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const recaptchaRef = useRef();
  const navigate = useNavigate();

  const checkStrength = (password) => {
    if (!password) return '';
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^]).{8,}$/;
    return strongRegex.test(password) ? 'Strong' : 'Weak';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') {
      setPasswordStrength(checkStrength(value));
    }
  };

  const validValue = Object.values(data).every((el) => el.trim() !== '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please verify the captcha");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error('Password and Confirm Password must match');
      return;
    }

    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^]).{8,}$/;
    if (!strongRegex.test(data.password)) {
      toast.error('Password must include uppercase, lowercase, number, symbol and be at least 8 characters.');
      return;
    }

    try {
      const response = await Axios({ ...SummaryApi.register, data });
      if (response.data.error) {
        toast.error(response.data.message);
      } else if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: '', email: '', password: '', confirmPassword: '' });
        recaptchaRef.current.reset();
        setCaptchaToken('');
        navigate('/login');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full px-4 py-10 bg-white text-gray-800 font-medium">
      <div className="max-w-xl mx-auto border border-gray-200 rounded-xl shadow-md p-8 bg-white">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16" />
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="grid gap-1">
            <label htmlFor="name" className="text-sm font-semibold">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={data.name}
              onChange={handleChange}
              className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
              style={{ fontSize: '0.875rem' }}
              autoFocus
              required
            />
          </div>

          {/* Email */}
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
            />
          </div>

          {/* Password */}
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

            <p className="text-sm text-gray-700 font-medium mt-1">
              Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.
            </p>

            {data.password && (
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
                placeholder="Re-enter your password"
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

          {/* reCAPTCHA */}
          <div>
            <ReCAPTCHA
              sitekey="6Lca0o4rAAAAAL1vVSb3_b8J9c9auKzp1svFHBj_" // Your site key
              onChange={(token) => setCaptchaToken(token)}
              ref={recaptchaRef}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
            <button
              type="submit"
              disabled={!validValue}
              className={`px-6 py-2 rounded text-white font-semibold transition ${
                validValue
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Signup
            </button>
            <p className="text-sm text-gray-700">
              Already have an account?{' '}
              <Link to="/login" className="text-green-700 font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
