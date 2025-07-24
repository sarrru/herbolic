import React from 'react';
import banner from '../assets/b.png';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const categoryData = useSelector(state => state.product.allCategory);
  const subCategoryData = useSelector(state => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => {
      return sub.category.some(c => c._id === id);
    });

    if (!subcategory) return;

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
  };

  return (
    <div className='bg-white'>
      {/* ✅ Full Width Banner */}
      <div className='w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'>
        <div className={`w-full ${!banner && 'animate-pulse'}`}>
          <img
            src={banner}
            className='w-full h-auto object-cover block'
            alt='Organic Products Banner - The natural choice for healthy living'
          />
        </div>
      </div>

      {/* ✅ Categories Section Heading */}
      <div className='container mx-auto px-4 mt-10 mb-6'>
        <h2 className='text-3xl font-bold text-left text-green-700'>
          Shop by category
        </h2>
      </div>

      {/* 🟢 Category Thumbnails */}
      <div className='container mx-auto px-4 my-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10'>
        {loadingCategory ? (
          new Array(12).fill(null).map((_, index) => (
            <div
              key={index + 'loadingcategory'}
              className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'
            >
              <div className='bg-blue-100 min-h-24 rounded'></div>
              <div className='bg-blue-100 h-8 rounded'></div>
            </div>
          ))
        ) : (
          categoryData.map((cat) => (
            <div
              key={cat._id + 'displayCategory'}
              className='cursor-pointer flex flex-col items-center space-y-2 group'
              onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
            >
              <div className='bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center shadow-md hover:shadow-lg transition'>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className='w-20 h-20 object-contain'
                />
              </div>
              <p className='text-center text-base font-medium text-gray-800 group-hover:text-green-600 transition'>
                {cat.name}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 🟢 Category-Wise Product Display */}
      <div className="pb-8">
        {categoryData?.map((c) => (
          <CategoryWiseProductDisplay
            key={c?._id + 'CategorywiseProduct'}
            id={c?._id}
            name={c?.name}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
