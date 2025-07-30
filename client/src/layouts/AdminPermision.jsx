// import React from 'react'
// import { useSelector } from 'react-redux'
// import isAdmin from '../utils/isAdmin'

// const AdminPermision = ({children}) => {
//     const user = useSelector(state => state.user)


//   return (
//     <>
//         {
//             isAdmin(user.role) ?  children :<p className="text-red-700 bg-red-100 border border-red-400 p-8 text-center text-xl rounded">
//   🚫 Access Denied: You do not have permission to view this page.
// </p>

//         }
//     </>
//   )
// }

// export default AdminPermision

// src/components/AdminPermision.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import isAdmin from '../utils/isAdmin';

const AdminPermision = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (!user || !isAdmin(user.role)) {
    // If not admin, redirect to Not Authorized page
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

export default AdminPermision;
