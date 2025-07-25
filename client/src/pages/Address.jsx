import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AddAddress from '../components/AddAddress';
import { MdDelete, MdEdit } from 'react-icons/md';
import EditAddressDetails from '../components/EditAddressDetails';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { useGlobalContext } from '../provider/GlobalProvider';

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: { _id: id },
      });
      if (response.data.success) {
        toast.success('Address removed');
        fetchAddress?.();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="font-medium text-gray-800">
      {/* Header */}
      <div className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <h2 className="text-base font-semibold truncate">Address</h2>
        <button
          onClick={() => setOpenAddress(true)}
          className="border border-primary-200 text-primary-200 px-3 hover:bg-primary-200 hover:text-black py-1 rounded-full text-sm font-semibold"
        >
          Add Address
        </button>
      </div>

      {/* Address List */}
      <div className="bg-blue-50 p-4 space-y-4">
        {addressList
          .filter((address) => address.status)
          .map((address) => (
            <div
              key={address._id}
              className="bg-white border rounded-lg p-4 flex justify-between items-start gap-4"
            >
              <div className="space-y-1 text-sm">
                <p>{address.address_line}</p>
                <p>{address.city}</p>
                <p>{address.state}</p>
                <p>
                  {address.country} - {address.pincode}
                </p>
                <p>{address.mobile}</p>
              </div>
              <div className="flex flex-col gap-3 items-center">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(address);
                  }}
                  className="bg-green-200 p-2 rounded hover:text-white hover:bg-green-600 transition"
                  title="Edit"
                >
                  <MdEdit size={18} />
                </button>
                <button
                  onClick={() => handleDisableAddress(address._id)}
                  className="bg-red-200 p-2 rounded hover:text-white hover:bg-red-600 transition"
                  title="Delete"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            </div>
          ))}

        {/* Add Address Box */}
        <div
          onClick={() => setOpenAddress(true)}
          className="h-16 bg-blue-100 border-2 border-dashed border-blue-300 rounded flex justify-center items-center text-sm cursor-pointer hover:bg-blue-200 transition"
        >
          + Add address
        </div>
      </div>

      {/* Modals */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
      {openEdit && <EditAddressDetails data={editData} close={() => setOpenEdit(false)} />}
    </div>
  );
};

export default Address;
