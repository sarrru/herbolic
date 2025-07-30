import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { valideURLConvert } from '../utils/valideURLConvert';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import { FaChevronUp } from 'react-icons/fa';

const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 200);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } bg-gray-800 bg-opacity-60 text-white p-3 rounded-full shadow-md hover:bg-opacity-80`}
      aria-label="Scroll to top"
    >
      <FaChevronUp size={20} />
    </button>
  );
};

const OrganicCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "NATURAL WELLNESS",
      subtitle: "Holistic Health",
      description: "Embrace natural healing with our premium wellness products. Sourced from nature's finest ingredients for your complete well-being.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=500&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "HERBAL REMEDIES",
      subtitle: "Ancient Wisdom",
      description: "Discover time-tested herbal solutions crafted with traditional knowledge and modern quality standards for optimal health.",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1200&h=500&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "PURE SUPPLEMENTS",
      subtitle: "Clean Nutrition",
      description: "Nourish your body with pure, organic supplements free from artificial additives. Support your health journey naturally.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=500&fit=crop&crop=center"
    },
    {
      id: 4,
      title: "MINDFUL LIVING",
      subtitle: "Balance & Harmony",
      description: "Create a harmonious lifestyle with our collection of wellness essentials. From aromatherapy to mindful nutrition.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&h=500&fit=crop&crop=center"
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => nextSlide(), 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  return (
    <div 
      className="relative w-full h-[400px] overflow-hidden bg-gray-900 shadow-lg"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 translate-x-0'
              : index < currentSlide
              ? 'opacity-0 -translate-x-full'
              : 'opacity-0 translate-x-full'
          }`}
        >
          <div className="flex h-full">
            <div className="w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-12">
              <div className="text-center max-w-md">
                <div className="mb-4">
                  <span className="inline-block bg-green-600 text-white text-xs font-bold tracking-widest px-4 py-2 rounded-full uppercase shadow-lg">
                    {slide.subtitle}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-white leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed font-medium">
                  {slide.description}
                </p>
              </div>
            </div>
            <div className="w-1/2 relative">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-900/10 to-gray-900/30"></div>
            </div>
          </div>
        </div>
      ))}

      <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200"
      >
        <ChevronLeft />
      </button>

      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-gray-200"
      >
        <ChevronRight />
      </button>

      {/* Updated Carousel Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-6 h-2 bg-white shadow-md scale-110' 
                : 'w-2 h-2 bg-white/60 hover:bg-white/80 hover:scale-125'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const categoryData = useSelector(state => state.product.allCategory);
  const subCategoryData = useSelector(state => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub => sub.category.some(c => c._id === id));
    if (!subcategory) return;

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
  };

  return (
    <div className='bg-white'>
      {/* ✨ Full Width Carousel with No Padding */}
      <div className='w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]'>
        <OrganicCarousel />
      </div>

      {/* ✅ Categories Section Heading */}
      <div className='container mx-auto px-4 mt-10 mb-6'>
        <div className="text-center mb-6">
          <span className="inline-block bg-green-100 text-green-800 text-lg md:text-xl font-bold tracking-wide px-8 py-3 rounded-full mb-6 shadow-sm">
            Explore Our Collection
          </span>
        </div>
      </div>

      {/* 🟢 Category Icons */}
      <div className='container mx-auto px-4 my-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-10'>
        {loadingCategory ? (
          new Array(12).fill(null).map((_, index) => (
            <div key={index + 'loading'} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
              <div className='bg-blue-100 min-h-24 rounded'></div>
              <div className='bg-blue-100 h-8 rounded'></div>
            </div>
          ))
        ) : (
          categoryData.map((cat) => (
            <div
              key={cat._id}
              className='cursor-pointer flex flex-col items-center space-y-2 group'
              onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
            >
              <div className='bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center shadow-md hover:shadow-lg transition'>
                <img src={cat.image} alt={cat.name} className='w-20 h-20 object-contain' />
              </div>
              <p className='text-center text-base font-medium text-gray-800 group-hover:text-green-600 transition'>
                {cat.name}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 🟢 Product Display by Category */}
      <div className="pb-8">
        {categoryData?.map((c) => (
          <CategoryWiseProductDisplay key={c?._id} id={c?._id} name={c?.name} />
        ))}
      </div>

      <ScrollToTopButton />
    </div>
  );
};

export default Home;
