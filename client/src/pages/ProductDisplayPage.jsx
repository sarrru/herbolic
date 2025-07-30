import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { FaAngleRight, FaAngleLeft, FaShare, FaCheck, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import Divider from '../components/Divider';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from '../components/AddToCartButton';

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "", 
    image: [], 
    description: "", 
    unit: "", 
    price: 0, 
    discount: 0, 
    stock: 0, 
    more_details: {}
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Axios({ 
        ...SummaryApi.getProductDetails, 
        data: { productId } 
      });
      
      if (response.data.success) {
        setData(response.data.data);
        setImage(0); // Reset to first image
      } else {
        setError("Product not found");
      }
    } catch (error) {
      AxiosToastError(error);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    } else {
      setError("Invalid product ID");
      setLoading(false);
    }
  }, [productId]);

  const handleScrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += 100;
    }
  };

  const handleScrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft -= 100;
    }
  };

  const handleImageLoad = () => setImageLoading(false);
  const handleImageError = () => setImageLoading(false);

  // Loading skeleton
  if (loading) {
    return (
      <section className="container mx-auto p-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 animate-pulse">
          {/* Left skeleton */}
          <div className="space-y-6">
            <div className="bg-gray-200 rounded-xl h-[400px]"></div>
            <div className="flex gap-2 justify-center">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="flex gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="bg-gray-200 rounded-xl h-48"></div>
          </div>
          
          {/* Right skeleton */}
          <div className="space-y-6 bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-14 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="container mx-auto p-4 min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            {error}
          </p>
          <button 
            onClick={fetchProductDetails} 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // No product data
  if (!data.name || !data.image?.length) {
    return (
      <section className="container mx-auto p-4 min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-500 text-3xl">📦</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Product Not Found
          </h2>
          <p className="text-gray-700 font-medium leading-relaxed">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto p-4 max-w-7xl">
      {/* Font rendering optimization */}
      <style jsx>{`
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
      `}</style>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT: Product Images */}
        <div className="space-y-6">
          {/* Main Product Image */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative group">
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center z-10">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={data.image[image]}
              alt={data.name}
              className="w-full h-[400px] lg:h-[500px] object-contain p-6 transition-transform duration-300 group-hover:scale-105"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            
            {/* Share button */}
            <div className="absolute top-4 right-4">
              <button className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
                <FaShare className="text-gray-600 text-lg" />
              </button>
            </div>
          </div>

          {/* Image Indicators */}
          {data.image.length > 1 && (
            <div className="flex items-center justify-center gap-2">
              {data.image.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImage(index)}
                  className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                    index === image 
                      ? "bg-green-600 scale-125 shadow-lg" 
                      : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail Gallery */}
          {data.image.length > 1 && (
            <div className="relative">
              <div
                ref={imageContainer}
                className="flex gap-3 overflow-x-auto scrollbar-none pb-2 scroll-smooth"
              >
                {data.image.map((img, index) => (
                  <div
                    key={index}
                    className={`min-w-[80px] w-20 h-20 cursor-pointer rounded-xl border-2 p-1 bg-white shadow-sm transition-all duration-300 hover:shadow-md ${
                      index === image 
                        ? "border-green-500 shadow-green-100" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${data.name} view ${index + 1}`}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {/* Scroll buttons for thumbnails */}
              {data.image.length > 4 && (
                <div className="hidden lg:flex justify-between absolute inset-y-0 w-full px-2 items-center pointer-events-none">
                  <button
                    onClick={handleScrollLeft}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all pointer-events-auto"
                  >
                    <FaAngleLeft className="text-gray-700" />
                  </button>
                  <button
                    onClick={handleScrollRight}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all pointer-events-auto"
                  >
                    <FaAngleRight className="text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Product Details Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {data.description && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {data.description}
                </p>
              </div>
            )}
            
            {data.unit && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                  Unit
                </h3>
                <p className="text-gray-700 font-medium">{data.unit}</p>
              </div>
            )}
            
            {data?.more_details && Object.keys(data.more_details).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                  Additional Details
                </h3>
                <div className="space-y-3">
                  {Object.entries(data.more_details).map(([key, value], index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-1 capitalize">
                        {key.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-gray-700 font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 space-y-6 sticky top-4">
            {/* Product Title */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  <FaTruck className="w-3 h-3" />
                  Fast Delivery
                </span>
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                  <FaShieldAlt className="w-3 h-3" />
                  Quality Assured
                </span>
              </div>
              
              <h1 className="text-2xl lg:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                {data.name}
              </h1>
              
              {data.unit && (
                <p className="text-gray-600 font-medium text-lg">{data.unit}</p>
              )}
            </div>

            <Divider />

            {/* Pricing Section */}
<div className="space-y-4">
  <h3 className="text-lg font-bold text-gray-900">Price</h3>
  <div className="space-y-3">
    <div className="flex flex-wrap items-center gap-4">
      {/* Discounted Price (Now more balanced) */}
      <span className="text-2xl font-bold text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-lg">
        {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
      </span>

      {/* Original Price & Discount */}
      {data.discount > 0 && (
        <div className="space-y-1">
          <span className="block line-through text-gray-500 font-medium text-base">
            {DisplayPriceInRupees(data.price)}
          </span>
          <span className="text-green-700 bg-green-100 font-semibold text-xs px-2 py-0.5 rounded-md inline-block">
            {data.discount}% OFF
          </span>
        </div>
      )}
    </div>

    {/* Savings */}
    {data.discount > 0 && (
      <p className="text-sm text-gray-600 font-medium">
        You save {DisplayPriceInRupees(data.price - pricewithDiscount(data.price, data.discount))}
      </p>
    )}
  </div>
</div>


         {data.stock > 0 ? (
  <>
    <FaCheck className="w-4 h-4" />
    <span>
      In Stock ({data.stock > 10 ? '10+' : data.stock} available)
    </span>
  </>
) : (
  <>
    <span className="w-4 h-4 text-center">⚠️</span>
    <span className="font-bold">Out of Stock</span>
  </>
)}


            {/* Add to Cart Section */}
            <div className="pt-6">
              {data.stock === 0 ? (
                <button 
                  disabled 
                  className="w-full bg-gray-300 text-gray-500 font-bold py-5 px-8 rounded-xl cursor-not-allowed text-xl"
                >
                  Out of Stock
                </button>
              ) : (
                <div className="w-full">
                  <AddToCartButton data={data} />
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
              <div className="text-center space-y-3">
                <FaTruck className="w-7 h-7 text-green-600 mx-auto" />
                <p className="text-sm text-gray-700 font-semibold">Fast Delivery</p>
              </div>
              <div className="text-center space-y-3">
                <FaShieldAlt className="w-7 h-7 text-blue-600 mx-auto" />
                <p className="text-sm text-gray-700 font-semibold">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;