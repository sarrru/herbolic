import React, { useState } from 'react';
import EditProductAdmin from './EditProductAdmin';
import CofirmBox from './CofirmBox';
import { IoClose } from 'react-icons/io5';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import toast from 'react-hot-toast';

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data: {
          _id: data._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchProductData) {
          fetchProductData();
        }
        setOpenDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="w-40 bg-white rounded-lg shadow-sm border p-3 text-sm text-gray-800 font-medium flex flex-col justify-between">
      {/* Image */}
      <div className="w-full h-36 border bg-blue-50 rounded overflow-hidden mb-2 flex items-center justify-center">
        <img
          src={data?.image[0]}
          alt={data?.name}
          className="object-scale-down w-full h-full"
        />
      </div>

      {/* Product Info */}
      <p className="line-clamp-2 text-sm font-semibold">{data?.name}</p>
      <p className="text-gray-500 text-xs">{data?.unit}</p>
      <p className="font-semibold mt-1">NPR {data?.price}</p>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        <button
          onClick={() => setEditOpen(true)}
          className="text-green-700 border border-green-600 hover:bg-green-100 py-1 rounded text-sm font-semibold"
        >
          Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="text-red-600 border border-red-500 hover:bg-red-100 py-1 rounded text-sm font-semibold"
        >
          Delete
        </button>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <EditProductAdmin
          fetchProductData={fetchProductData}
          data={data}
          close={() => setEditOpen(false)}
        />
      )}

      {/* Delete Confirmation */}
      {openDelete && (
        <section className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm p-5 rounded-md shadow-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Permanent Delete</h3>
              <button
                onClick={() => setOpenDelete(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <IoClose size={24} />
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to permanently delete this product?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-1 text-sm text-red-600 border border-red-500 rounded hover:bg-red-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-1 text-sm text-green-700 border border-green-600 rounded hover:bg-green-50"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductCardAdmin;
