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
  const [selectAddress, setSelectAddress] = useState(0);
  const addressList = useSelector((state) => state.addresses.addressList);
  const cartItemsList = useSelector((state) => state.cartItem.cart);
  const navigate = useNavigate();

  const selectedAddress = addressList?.[selectAddress];

  const handleCashOnDelivery = async () => {
    if (!selectedAddress) return toast.error('Please select a valid address');

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

      const responseData = response?.data;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem?.();
        fetchOrder?.();
        navigate('/success', { state: { text: 'Order' } });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    if (!selectedAddress) return toast.error('Please select a valid address');

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
    <section className="bg-blue-50 min-h-screen font-medium text-gray-800">
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Address Section */}
        <div className="w-full lg:w-2/3">
          <h3 className="text-lg font-semibold mb-2">Choose Your Address</h3>
          <div className="bg-white p-4 rounded shadow-sm space-y-4">
            {addressList?.length > 0 ? (
              addressList.map((address, index) =>
                address.status ? (
                  <label
                    key={index}
                    htmlFor={'address' + index}
                    className="block"
                  >
                    <div className="border p-3 rounded flex items-start gap-3 hover:bg-blue-50 transition text-sm">
                      <input
                        id={'address' + index}
                        type="radio"
                        name="address"
                        value={index}
                        checked={selectAddress === index}
                        onChange={(e) => setSelectAddress(Number(e.target.value))}
                        className="mt-1"
                      />
                      <div className="space-y-0.5">
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
                ) : null
              )
            ) : (
              <p className="text-sm text-gray-500">
                No address found. Please add one below.
              </p>
            )}

            <div
              onClick={() => setOpenAddress(true)}
              className="h-14 bg-blue-50 border-2 border-dashed flex justify-center items-center text-green-700 font-semibold cursor-pointer rounded"
            >
              + Add New Address
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="w-full lg:w-1/3 bg-white p-5 rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="flex gap-2 items-center">
                <s className="text-gray-400">
                  {DisplayPriceInRupees(notDiscountTotalPrice)}
                </s>
                {DisplayPriceInRupees(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Quantity</span>
              <span>{totalQty} item(s)</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-base">
              <span>Grand Total</span>
              <span>{DisplayPriceInRupees(totalPrice)}</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              onClick={handleOnlinePayment}
              disabled={!selectedAddress}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm transition"
            >
              Pay Online
            </button>
            <button
              onClick={handleCashOnDelivery}
              disabled={!selectedAddress}
              className="w-full py-2 border border-green-600 text-green-700 hover:bg-green-700 hover:text-white rounded font-semibold text-sm transition"
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;
