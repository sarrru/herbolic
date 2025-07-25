// import React from 'react'
// import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
// import { Link } from 'react-router-dom'
// import { valideURLConvert } from '../utils/valideURLConvert'
// import { pricewithDiscount } from '../utils/PriceWithDiscount'
// import SummaryApi from '../common/SummaryApi'
// import AxiosToastError from '../utils/AxiosToastError'
// import Axios from '../utils/Axios'
// import toast from 'react-hot-toast'
// import { useState } from 'react'
// import { useGlobalContext } from '../provider/GlobalProvider'
// import AddToCartButton from './AddToCartButton'

// const CardProduct = ({data}) => {
//     const url = `/product/${valideURLConvert(data.name)}-${data._id}`
//     const [loading,setLoading] = useState(false)
  
//   return (
//     <Link to={url} className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white' >
//       <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
//             <img 
//                 src={data.image[0]}
//                 className='w-full h-full object-scale-down lg:scale-125'
//             />
//       </div>
//       <div className='flex items-center gap-1'>
//         <div className='rounded text-xs w-fit p-[1px] px-2 text-green-600 bg-green-50'>
//               10 min 
//         </div>
//         <div>
//             {
//               Boolean(data.discount) && (
//                 <p className='text-green-600 bg-green-100 px-2 w-fit text-xs rounded-full'>{data.discount}% discount</p>
//               )
//             }
//         </div>
//       </div>
//       <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
//         {data.name}
//       </div>
//       <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
//         {data.unit} 
        
//       </div>

//       <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text-base'>
//         <div className='flex items-center gap-1'>
//           <div className='font-semibold'>
//               {DisplayPriceInRupees(pricewithDiscount(data.price,data.discount))} 
//           </div>
          
          
//         </div>
//         <div className=''>
//           {
//             data.stock == 0 ? (
//               <p className='text-red-500 text-sm text-center'>Out of stock</p>
//             ) : (
//               <AddToCartButton data={data} />
//             )
//           }
            
//         </div>
//       </div>

//     </Link>
//   )
// }

// export default CardProduct

import React, { useState } from 'react';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { Link } from 'react-router-dom';
import { valideURLConvert } from '../utils/valideURLConvert';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from './AddToCartButton';

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`;
  const [loading, setLoading] = useState(false);

  return (
    <Link
      to={url}
      className='border py-2 lg:p-4 grid gap-2 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white hover:shadow-md transition-shadow duration-200'
    >
      {/* ✅ Product Image */}
      <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden flex items-center justify-center'>
        <img
          src={data.image[0]}
          alt={data.name}
          className='w-full h-full object-scale-down lg:scale-125'
        />
      </div>

      {/* ✅ Badges */}
      <div className='flex items-center gap-2 px-2 lg:px-0'>
        <span className='rounded text-xs w-fit py-0.5 px-2 text-green-700 font-medium bg-green-100'>
          10 min
        </span>
        {Boolean(data.discount) && (
          <span className='text-green-700 font-medium bg-green-100 px-2 py-0.5 w-fit text-xs rounded-full'>
            {data.discount}% discount
          </span>
        )}
      </div>

      {/* ✅ Product Name */}
      <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2 text-gray-800'>
        {data.name}
      </div>

      {/* ✅ Product Unit */}
      <div className='w-fit px-2 lg:px-0 text-sm lg:text-base text-gray-700 font-medium'>
        {data.unit}
      </div>

      {/* ✅ Price + Add to Cart */}
      <div className='px-2 lg:px-0 flex items-center justify-between gap-2 lg:gap-3 text-sm lg:text-base'>
        <div className='flex items-center gap-1'>
          <div className='font-semibold text-black'>
            {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
          </div>
        </div>
        <div>
          {data.stock === 0 ? (
            <p className='text-red-500 text-sm text-center'>Out of stock</p>
          ) : (
            <AddToCartButton data={data} />
          )}
        </div>
      </div>
    </Link>
  );
};

export default CardProduct;
