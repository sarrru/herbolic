import React from 'react';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import { FaCaretRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import AddToCartButton from './AddToCartButton';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import imageEmpty from '../assets/empty_cart.webp';
import toast from 'react-hot-toast';

const DisplayCartItem = ({ close }) => {
  const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate('/checkout');
      if (close) close();
    } else {
      toast('Please Login');
    }
  };

  return (
    <section className="bg-neutral-900 fixed inset-0 z-50 bg-opacity-70 font-medium text-gray-800">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto flex flex-col text-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 shadow-md border-b">
          <h2 className="font-semibold text-base">Cart</h2>
          <button onClick={close} className="text-neutral-600 hover:text-red-500">
            <IoClose size={24} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-grow bg-blue-50 p-3 overflow-y-auto space-y-4">
          {cartItem?.length > 0 ? (
            <>
              {/* Total Savings */}
              <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                <span>Your total savings</span>
                <span>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</span>
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded p-3 space-y-4 shadow-sm">
                {cartItem.map((item, index) => (
                  <div
                    key={item?._id + 'cartItemDisplay'}
                    className="flex gap-3 border-b pb-3"
                  >
                    <div className="w-16 h-16 bg-blue-100 border rounded overflow-hidden">
                      <img
                        src={item?.productId?.image[0]}
                        alt={item?.productId?.name}
                        className="w-full h-full object-scale-down"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold line-clamp-2">{item?.productId?.name}</p>
                      <p className="text-gray-500 text-xs">{item?.productId?.unit}</p>
                      <p className="font-semibold mt-1">
                        {DisplayPriceInRupees(
                          pricewithDiscount(
                            item?.productId?.price,
                            item?.productId?.discount
                          )
                        )}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <AddToCartButton data={item?.productId} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Summary */}
              <div className="bg-white rounded p-4 shadow-sm space-y-2">
                <h3 className="font-semibold mb-2 text-base">Bill Details</h3>
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span className="flex gap-2 items-center">
                    <s className="text-gray-400">
                      {DisplayPriceInRupees(notDiscountTotalPrice)}
                    </s>
                    <span>{DisplayPriceInRupees(totalPrice)}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quantity</span>
                  <span>{totalQty} item(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-base">
                  <span>Grand Total</span>
                  <span>{DisplayPriceInRupees(totalPrice)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded p-6 flex flex-col items-center justify-center space-y-4">
              <img
                src={imageEmpty}
                alt="Empty Cart"
                className="w-full h-auto object-scale-down"
              />
              <Link
                onClick={close}
                to="/"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold text-sm"
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>

        {/* Bottom Checkout Bar */}
        {cartItem?.length > 0 && (
          <div className="p-3 border-t bg-white">
            <div className="flex items-center justify-between bg-green-700 text-white px-4 py-3 rounded font-semibold text-sm">
              <span>{DisplayPriceInRupees(totalPrice)}</span>
              <button
                onClick={redirectToCheckoutPage}
                className="flex items-center gap-2 hover:underline"
              >
                Proceed <FaCaretRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inline style for placeholder font */}
      <style jsx>{`
        input::placeholder {
          font-size: 0.75rem;
        }
      `}</style>
    </section>
  );
};

export default DisplayCartItem;
