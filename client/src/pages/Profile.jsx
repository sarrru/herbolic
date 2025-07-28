import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegUserCircle } from 'react-icons/fa';
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';
import { setUserDetails } from '../store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.updateUserDetails,
        data: userData,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        const userData = await fetchUserDetails();
        dispatch(setUserDetails(userData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-gray-800 font-medium">
      {/* Profile Image */}
      <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden shadow-md">
        {user.avatar ? (
          <img
            alt={user.name}
            src={user.avatar}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>

      {/* Edit Button */}
      <button
        onClick={() => setProfileAvatarEdit(true)}
        className="text-sm min-w-20 border border-green-500 hover:bg-green-100 text-green-700 px-3 py-1 rounded-full mt-3 transition"
      >
        Edit
      </button>

      {/* Avatar Editor */}
      {openProfileAvatarEdit && (
        <UserProfileAvatarEdit close={() => setProfileAvatarEdit(false)} />
      )}

      {/* Profile Form */}
      <form className="my-6 grid gap-5 max-w-md" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="grid gap-1">
          <label htmlFor="name" className="text-sm font-semibold">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
            style={{ fontSize: '0.875rem' }}
            value={userData.name}
            name="name"
            onChange={handleOnChange}
            required
          />
        </div>

        {/* Email */}
        <div className="grid gap-1">
          <label htmlFor="email" className="text-sm font-semibold">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
            style={{ fontSize: '0.875rem' }}
            value={userData.email}
            name="email"
            onChange={handleOnChange}
            required
          />
        </div>

        {/* Mobile */}
        <div className="grid gap-1">
          <label htmlFor="mobile" className="text-sm font-semibold">Mobile</label>
          <input
            type="text"
            id="mobile"
            placeholder="Enter your mobile"
            className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
            style={{ fontSize: '0.875rem' }}
            value={userData.mobile}
            name="mobile"
            onChange={handleOnChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
        >
          {loading ? 'Loading...' : 'Submit'}
        </button>
      </form>

      {/* Style for placeholder font size */}
      <style jsx>{`
        input::placeholder {
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default Profile;
