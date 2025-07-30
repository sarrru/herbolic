// import React, { useEffect, useRef, useState } from 'react'
// import { Link, } from 'react-router-dom'
// import AxiosToastError from '../utils/AxiosToastError'
// import Axios from '../utils/Axios'
// import SummaryApi from '../common/SummaryApi'
// import CardLoading from './CardLoading'
// import CardProduct from './CardProduct'
// import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
// import { useSelector } from 'react-redux'
// import { valideURLConvert } from '../utils/valideURLConvert'

// const CategoryWiseProductDisplay = ({ id, name }) => {
//     const [data, setData] = useState([])
//     const [loading, setLoading] = useState(false)
//     const containerRef = useRef()
//     const subCategoryData = useSelector(state => state.product.allSubCategory)
//     const loadingCardNumber = new Array(6).fill(null)

//     const fetchCategoryWiseProduct = async () => {
//         try {
//             setLoading(true)
//             const response = await Axios({
//                 ...SummaryApi.getProductByCategory,
//                 data: {
//                     id: id
//                 }
//             })

//             const { data: responseData } = response

//             if (responseData.success) {
//                 setData(responseData.data)
//             }
//         } catch (error) {
//             AxiosToastError(error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         fetchCategoryWiseProduct()
//     }, [])

//     const handleScrollRight = () => {
//         containerRef.current.scrollLeft += 200
//     }

//     const handleScrollLeft = () => {
//         containerRef.current.scrollLeft -= 200
//     }

    

  

//   const handleRedirectProductListpage = ()=>{
//       const subcategory = subCategoryData.find(sub =>{
//         const filterData = sub.category.some(c => {
//           return c._id == id
//         })

//         return filterData ? true : null
//       })
//       const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

//       return url
//   }

//   const redirectURL =  handleRedirectProductListpage()
//     return (
//         <div>
//             <div className='container mx-auto p-4 flex items-center justify-between gap-4'>
//                 <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
//                 <Link  to={redirectURL} className='text-green-600 hover:text-green-400'>See All</Link>
//             </div>
//             <div className='relative flex items-center '>
//                 <div className=' flex gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scrollbar-none scroll-smooth' ref={containerRef}>
//                     {loading &&
//                         loadingCardNumber.map((_, index) => {
//                             return (
//                                 <CardLoading key={"CategorywiseProductDisplay123" + index} />
//                             )
//                         })
//                     }


//                     {
//                         data.map((p, index) => {
//                             return (
//                                 <CardProduct
//                                     data={p}
//                                     key={p._id + "CategorywiseProductDisplay" + index}
//                                 />
//                             )
//                         })
//                     }

//                 </div>
//                 <div className='w-full left-0 right-0 container mx-auto  px-2  absolute hidden lg:flex justify-between'>
//                     <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full'>
//                         <FaAngleLeft />
//                     </button>
//                     <button onClick={handleScrollRight} className='z-10 relative  bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full'>
//                         <FaAngleRight />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CategoryWiseProductDisplay

import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const loadingCardNumber = new Array(6).fill(null)

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id: id }
      })
      const { data: responseData } = response
      if (responseData.success) setData(responseData.data)
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryWiseProduct()
  }, [])

  const handleRedirectProductListpage = () => {
    const subcategory = subCategoryData.find(sub =>
      sub.category.some(c => c._id === id)
    )
    const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`
    return url
  }

  const redirectURL = handleRedirectProductListpage()

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="bg-white shadow rounded-xl px-6 py-5 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-2">
          <div className="relative inline-block">
            <h3 className="text-2xl font-extrabold text-gray-800 capitalize">
              {name}
            </h3>
            <span className="block w-12 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mt-1" />
          </div>

          <Link
            to={redirectURL}
            className="text-sm font-semibold text-green-600 hover:text-green-700 transition px-4 py-1 border border-green-200 hover:border-green-400 rounded-full"
          >
            See All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading ? (
            loadingCardNumber.map((_, index) => (
              <CardLoading key={"CategorywiseProductDisplay" + index} />
            ))
          ) : data.length > 0 ? (
            data.map((p, index) => (
              <CardProduct
                data={p}
                key={p._id + "CategorywiseProductDisplay" + index}
              />
            ))
          ) : (
            <p className="col-span-full text-gray-500 font-medium tracking-tight">
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default CategoryWiseProductDisplay
