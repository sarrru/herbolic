import React from 'react';
import { useForm } from 'react-hook-form';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { IoClose } from 'react-icons/io5';
import { useGlobalContext } from '../provider/GlobalProvider';

const AddAddress = ({ close }) => {
  const { register, handleSubmit, reset } = useForm();
  const { fetchAddress } = useGlobalContext();

  const onSubmit = async (data) => {
    try {
      const response = await Axios({
        ...SummaryApi.createAddress,
        data: {
          address_line: data.addressline,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
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
    <section className="fixed inset-0 z-50 bg-black bg-opacity-70 h-screen overflow-auto font-medium text-gray-800">
      <div className="bg-white p-6 w-full max-w-lg mt-10 mx-auto rounded shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Address</h2>
          <button onClick={close} className="hover:text-red-600">
            <IoClose size={24} />
          </button>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          {[
            { id: 'addressline', label: 'Address Line', placeholder: 'Enter your address' },
            { id: 'city', label: 'City', placeholder: 'Enter your city' },
            { id: 'state', label: 'State', placeholder: 'Enter your state' },
            { id: 'pincode', label: 'Pincode', placeholder: 'Enter your pincode' },
            { id: 'country', label: 'Country', placeholder: 'Enter your country' },
            { id: 'mobile', label: 'Mobile No.', placeholder: 'Enter mobile number' },
          ].map(({ id, label, placeholder }) => (
            <div key={id} className="grid gap-1">
              <label htmlFor={id} className="text-sm font-semibold">
                {label}
              </label>
              <input
                type="text"
                id={id}
                placeholder={placeholder}
                className="bg-blue-50 p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500 text-sm"
                {...register(id, { required: true })}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold text-sm transition"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAddress;
