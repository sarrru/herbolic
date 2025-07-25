// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Link, useNavigate } from 'react-router-dom'
// import Divider from './Divider'
// import Axios from '../utils/Axios'
// import SummaryApi from '../common/SummaryApi'
// import { logout } from '../store/userSlice'
// import toast from 'react-hot-toast'
// import AxiosToastError from '../utils/AxiosToastError'
// import { HiOutlineExternalLink } from "react-icons/hi";
// import isAdmin from '../utils/isAdmin'

// const UserMenu = ({close}) => {
//    const user = useSelector((state)=> state.user)
//    const dispatch = useDispatch()
//    const navigate = useNavigate()

//    const handleLogout = async()=>{
//         try {
//           const response = await Axios({
//              ...SummaryApi.logout
//           })
//           console.log("logout",response)
//           if(response.data.success){
//             if(close){
//               close()
//             }
//             dispatch(logout())
//             localStorage.clear()
//             toast.success(response.data.message)
//             navigate("/")
//           }
//         } catch (error) {
//           console.log(error)
//           AxiosToastError(error)
//         }
//    }

//    const handleClose = ()=>{
//       if(close){
//         close()
//       }
//    }
//   return (
//     <div>
//         <div className='font-semibold'>My Account</div>
//         <div className='text-sm flex items-center gap-2'>
//           <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile} <span className='text-medium text-red-600'>{user.role === "ADMIN" ? "(Admin)" : "" }</span></span>
//           <Link onClick={handleClose} to={"/dashboard/profile"} className='hover:text-primary-200'>
//             <HiOutlineExternalLink size={15}/>
//           </Link>
//         </div>

//         <Divider/>

//         <div className='text-sm grid gap-1'>
//             {
//               isAdmin(user.role) && (
//                 <Link onClick={handleClose} to={"/dashboard/category"} className='px-2 hover:bg-orange-200 py-1'>Category</Link>
//               )
//             }

//             {
//               isAdmin(user.role) && (
//                 <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2 hover:bg-orange-200 py-1'>Sub Category</Link>
//               )
//             }

//             {
//               isAdmin(user.role) && (
//                 <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2 hover:bg-orange-200 py-1'>Upload Product</Link>
//               )
//             }

//             {
//               isAdmin(user.role) && (
//                 <Link onClick={handleClose} to={"/dashboard/product"} className='px-2 hover:bg-orange-200 py-1'>Product</Link>
//               )
//             }

//             <Link onClick={handleClose} to={"/dashboard/myorders"} className='px-2 hover:bg-orange-200 py-1'>My Orders</Link>

//             <Link onClick={handleClose} to={"/dashboard/address"} className='px-2 hover:bg-orange-200 py-1'>Save Address</Link>

//             <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200 py-1'>Log Out</button>

//         </div>
//     </div>
//   )
// }

// export default UserMenu

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Divider from './Divider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { logout } from '../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { HiOutlineExternalLink } from 'react-icons/hi';
import isAdmin from '../utils/isAdmin';

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout });
      if (response.data.success) {
        if (close) close();
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate('/');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) close();
  };

  return (
    <div className="text-gray-800">
      <div className="font-bold text-lg mb-1">My Account</div>
      <div className="text-sm flex items-center gap-2 mb-2">
        <span className="max-w-52 text-ellipsis line-clamp-1 font-medium">
          {user.name || user.mobile}{' '}
          <span className="text-sm text-red-600 font-semibold">
            {user.role === 'ADMIN' ? '(Admin)' : ''}
          </span>
        </span>
        <Link
          onClick={handleClose}
          to="/dashboard/profile"
          className="hover:text-green-600 transition"
        >
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      <div className="text-sm grid gap-1 mt-2 font-medium">
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to="/dashboard/category"
            className="px-3 py-1 rounded hover:bg-green-100 transition"
          >
            Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to="/dashboard/subcategory"
            className="px-3 py-1 rounded hover:bg-green-100 transition"
          >
            Sub Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to="/dashboard/upload-product"
            className="px-3 py-1 rounded hover:bg-green-100 transition"
          >
            Upload Product
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to="/dashboard/product"
            className="px-3 py-1 rounded hover:bg-green-100 transition"
          >
            Product
          </Link>
        )}

        <Link
          onClick={handleClose}
          to="/dashboard/myorders"
          className="px-3 py-1 rounded hover:bg-green-100 transition"
        >
          My Orders
        </Link>

        <Link
          onClick={handleClose}
          to="/dashboard/address"
          className="px-3 py-1 rounded hover:bg-green-100 transition"
        >
          Save Address
        </Link>

        <button
          onClick={handleLogout}
          className="text-left px-3 py-1 rounded hover:bg-red-100 hover:text-red-600 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
