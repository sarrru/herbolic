import React, { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from 'react-icons/fa';
import useMobile from '../hooks/useMobile';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  const params = useLocation();
  const searchText = decodeURIComponent(params.search?.split('=')[1] || '');

  useEffect(() => {
    setIsSearchPage(location.pathname === '/search');
  }, [location]);

  const redirectToSearchPage = () => {
    navigate('/search');
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    const url = `/search?q=${encodeURIComponent(value)}`;
    navigate(url);
  };

  return (
    <div className="w-full flex justify-center items-center min-h-[80px]">
      <div
        className={`flex items-center w-full max-w-xl border border-green-700 rounded overflow-hidden shadow-sm ${
          isSearchPage ? 'shadow-md' : ''
        }`}
      >
        {isMobile && isSearchPage && (
          <Link
            to="/"
            className="flex justify-center items-center h-full px-4 text-green-700 bg-white"
          >
            <FaArrowLeft size={20} />
          </Link>
        )}

        <div className="flex-1 bg-white">
          {isSearchPage ? (
            <input
              type="text"
              autoFocus
              placeholder="Search for items..."
              defaultValue={searchText}
              onChange={handleOnChange}
              className="w-full h-12 px-6 text-gray-700 placeholder-gray-400 text-lg outline-none bg-transparent"
            />
          ) : (
            <div
              onClick={redirectToSearchPage}
              className="w-full h-12 flex items-center px-6 text-gray-400 cursor-pointer text-lg"
            >
              <TypeAnimation
                sequence={[
                  'Search "Rice"',
                  1500,
                  'Search "Honey"',
                  1500,
                  'Search "Tea & Coffee"',
                  1500,
                  'Search "Flour"',
                  1500,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </div>
          )}
        </div>

        <button
          className="bg-green-700 hover:bg-green-800 px-6 h-12 flex items-center justify-center text-white"
          style={{ borderLeft: '1px solid #166534' }} // optional separator
        >
          <IoSearch size={22} />
        </button>
      </div>
    </div>
  );
};

export default Search;
