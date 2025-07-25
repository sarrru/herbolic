import React from 'react';
import { useForm } from 'react-hook-form';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { IoClose } from 'react-icons/io5';
import { useGlobalContext } from '../provider/GlobalProvider';

const EditAddressDetails = ({ close, data }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      _id: data._id,
      userId: data.userId,
      address_line: data.address_line,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      mobile: data.mobile,
    },
  });

  const { fetchAddress } = useGlobalContext();

  const onSubmit = async (formData) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateAddress,
        data: {
          ...formData,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
          reset();
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-black fixed inset-0 z-50 bg-opacity-70 h-screen overflow-auto">
      <div className="bg-white p-6 w-full max-w-lg mt-10 mx-auto rounded shadow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Edit Address</h2>
          <button onClick={close} className="text-gray-600 hover:text-red-500">
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form className="grid gap-4 text-sm font-medium text-gray-700" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1">
            <label htmlFor="addressline">Address Line</label>
            <input
              type="text"
              id="addressline"
              className="border border-gray-300 bg-blue-50 p-2 rounded focus:outline-none focus:border-green-500 placeholder:text-sm placeholder-gray-500"
              {...register('address_line', { required: true })}
              placeholder="e.g. 123 Main Street"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              className="border border-gray-300 bg-blue-50 p-2 rounded focus:outline-none focus:border-green-500 placeholder:text-sm placeholder-gray-500"
              {...register('city', { required: true })}
              placeholder="e.g. Kathmandu"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              className="border border-gray-300 bg-blue-50 p-2 rounded focus:outline-none focus:border-green-500 placeholder:text-sm placeholder-gray-500"
              {...register('state', { required: true })}
              placeholder="e.g. Bagmati"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="pincode">Pincode</label>
            <input
              type="text"
              id="pincode"
              className="border border-gray-300 bg-blue-50 p-2 rounded focus:outline-none focus:border-green-500 placeholder:text-sm placeholder-gray-500"
              {...register('pincode', { required: true })}
              placeholder="e.g. 44600"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              className="border border-gray-300 bg-blue-50 p-2 rounded focus:outline-none focus:border-green-500 placeholder:text-sm placeholder-gray-500"
              {...register('country', { required: true })}
              placeholder="e.g. Nepal"
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="mobile">Mobile No.</label>
            <input
              type="text"
              id="mobile"
              className="border border-gray-300 bg-blue-50 p-2 rounded focus:outline-none focus:border-green-500 placeholder:text-sm placeholder-gray-500"
              {...register('mobile', { required: true })}
              placeholder="e.g. 9800000000"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditAddressDetails;
