import React, { useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import AddAddress from '../components/AddAddress';
import { useSelector } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const CheckoutPage = () => {
  const {
    notDiscountTotalPrice,
    totalPrice,
    totalQty,
    fetchCartItem,
    fetchOrder,
  } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const [selectAddress, setSelectAddress] = useState(0);
  const navigate = useNavigate();

  const selectedAddress = addressList?.[selectAddress];

  const handleCashOnDelivery = async () => {
    if (!selectedAddress) {
      toast.error('Please select a valid address');
      return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: selectedAddress._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem?.();
        fetchOrder?.();
        navigate('/success', {
          state: {
            text: 'Order',
          },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    if (!selectedAddress) {
      toast.error('Please select a valid address');
      return;
    }

    try {
      toast.loading('Loading...');
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const stripePromise = await loadStripe(stripePublicKey);

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: cartItemsList,
          addressId: selectedAddress._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      stripePromise.redirectToCheckout({ sessionId: responseData.id });

      fetchCartItem?.();
      fetchOrder?.();
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-blue-50 min-h-screen">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          {/* Address Section */}
          <h3 className="text-lg font-semibold mb-2">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList?.length > 0 ? (
              addressList.map((address, index) => (
                <label
                  key={index}
                  htmlFor={'address' + index}
                  className={!address.status ? 'hidden' : ''}
                >
                  <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                    <input
                      id={'address' + index}
                      type="radio"
                      value={index}
                      checked={selectAddress === index}
                      onChange={(e) => setSelectAddress(Number(e.target.value))}
                      name="address"
                    />
                    <div>
                      <p>{address.address_line}</p>
                      <p>{address.city}</p>
                      <p>{address.state}</p>
                      <p>
                        {address.country} - {address.pincode}
                      </p>
                      <p>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-gray-600 text-sm">
                No address found. Please add one below.
              </p>
            )}

            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer text-green-700 font-semibold"
            >
              + Add New Address
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full max-w-md bg-white py-4 px-4 shadow-sm rounded-md">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="flex items-center gap-2">
                <s className="text-gray-400">
                  {DisplayPriceInRupees(notDiscountTotalPrice)}
                </s>
                {DisplayPriceInRupees(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Quantity Total</span>
              <span>{totalQty} item(s)</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Grand Total</span>
              <span>{DisplayPriceInRupees(totalPrice)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              className="py-2 px-4 bg-green-700 hover:bg-green-800 rounded text-white font-semibold"
              onClick={handleOnlinePayment}
              disabled={!selectedAddress}
            >
              Pay Online
            </button>

            <button
              className="py-2 px-4 border-2 border-green-600 font-semibold text-green-700 hover:bg-green-700 hover:text-white rounded"
              onClick={handleCashOnDelivery}
              disabled={!selectedAddress}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
