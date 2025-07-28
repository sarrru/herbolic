import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation();

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password");
    }
  }, []);

  const valideValue = data.every(el => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data: {
          otp: data.join(""),
          email: location?.state?.email
        },
        withCredentials: true
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password", {
          state: {
            data: response.data,
            email: location?.state?.email
          }
        });
      }

    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="w-full container mx-auto px-2 font-medium text-neutral-800">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7 shadow-md">
        <p className="text-xl font-semibold mb-2">Enter OTP</p>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="otp" className="text-sm font-medium text-gray-700">
              Enter Your OTP:
            </label>
            <div className="flex items-center gap-2 justify-between mt-3">
              {data.map((element, index) => (
                <input
                  key={"otp" + index}
                  type="text"
                  id="otp"
                  ref={(ref) => {
                    inputRef.current[index] = ref;
                    return ref;
                  }}
                  value={data[index]}
                  onChange={(e) => {
                    const value = e.target.value;
                    const newData = [...data];
                    newData[index] = value;
                    setData(newData);

                    if (value && index < 5) {
                      inputRef.current[index + 1].focus();
                    }
                  }}
                  maxLength={1}
                  className="bg-blue-50 w-full max-w-16 p-2 border border-gray-300 rounded outline-none focus:border-green-500 text-center font-semibold text-lg"
                />
              ))}
            </div>
          </div>

          <button
            disabled={!valideValue}
            className={`w-full py-2 rounded text-white font-semibold tracking-wide text-sm transition ${
              valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Verify OTP
          </button>
        </form>

        <p className="text-sm text-gray-700 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 hover:text-green-800 font-semibold underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification;
