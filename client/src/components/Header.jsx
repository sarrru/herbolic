import React, { useEffect, useState } from 'react';
import tajaLogo from '../assets/image.png';
import Search from './Search';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector(state => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/user");
  };

  return (
    <>
      <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
        {
          !(isSearchPage && isMobile) && (
            <div className="w-full max-w-screen-2xl mx-auto flex items-center px-6 justify-between">

              {/* Logo */}
              <div className="h-full">
                <Link to="/" className="h-full flex justify-center items-center">
                  <img src={tajaLogo} alt="Herbolic Logo" className="hidden lg:block h-[90px] w-auto" />
                  <img src={tajaLogo} alt="Herbolic Logo" className="lg:hidden h-[84px] w-auto" />


                </Link>
              </div>

              {/* Search */}
              <div className="hidden lg:block flex-1 mx-8 max-w-lg">
                <Search />
              </div>

              {/* Login / Cart */}
              <div className="">
                <button className="text-neutral-600 lg:hidden" onClick={handleMobileUser}>
                  <FaRegCircleUser size={26} />
                </button>

                <div className="hidden lg:flex items-center gap-10">
                  {user?._id ? (
                    <div className="relative">
                      <div
                        onClick={() => setOpenUserMenu(prev => !prev)}
                        className="flex select-none items-center gap-1 cursor-pointer hover:text-green-700 transition"
                      >
                        <p className="font-bold text-black">Account</p>
                        {openUserMenu ? <GoTriangleUp size={25} /> : <GoTriangleDown size={25} />}
                      </div>
                      {openUserMenu && (
                        <div className="absolute right-0 top-12">
                          <div className="bg-white rounded p-4 min-w-52 lg:shadow-lg">
                            <UserMenu close={handleCloseUserMenu} />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={redirectToLoginPage}
                      className="text-lg font-semibold text-gray-700 hover:text-green-700 transition"
                    >
                      Login
                    </button>


                  )}

                  <button
                    onClick={() => setOpenCartSection(true)}
                    className="flex items-center gap-2 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white"
                  >
                    <div className="animate-bounce">
                      <BsCart4 size={26} />
                    </div>
                    <div className="font-semibold text-sm">
                      {cartItem[0] ? (
                        <div>
                          <p>{totalQty} Items</p>
                          <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>
                      ) : (
                        <p className="font-semibold">My Cart</p>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )
        }
      </header>

      {/* Mobile Search */}
      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>

      {/* Cart Drawer */}
      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </>
  );
};

export default Header;
