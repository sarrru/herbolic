import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const UploadCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({ name: "", image: "" });
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.addCategory, data });
      const responseData = response?.data;

      if (responseData?.success) {
        toast.success(responseData.message);
        close();
        fetchData();
      } else {
        toast.error(responseData?.message || "Something went wrong");
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await uploadImage(file);
      const imageUrl = response?.data?.data?.secure_url;

      if (!imageUrl) throw new Error("Image upload failed or returned unexpected data");

      setData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Image upload error:", error);
    }
  };

  return (
    <section className="fixed inset-0 bg-neutral-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white max-w-xl w-full rounded shadow-md p-6 text-gray-800 font-medium">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Category</h2>
          <button onClick={close} className="text-gray-500 hover:text-black">
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          {/* Category Name */}
          <div className="grid gap-1">
            <label htmlFor="categoryName" className="font-semibold text-sm">Name</label>
            <input
              type="text"
              id="categoryName"
              name="name"
              placeholder="Enter category name"
              value={data.name}
              onChange={handleOnChange}
              className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
              style={{ fontSize: '0.875rem' }}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="grid gap-2">
            <label className="font-semibold text-sm">Image</label>
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="border bg-gray-100 h-36 w-full lg:w-36 flex items-center justify-center rounded overflow-hidden">
                {data.image ? (
                  <img src={data.image} alt="category" className="object-scale-down w-full h-full" />
                ) : (
                  <p className="text-sm text-gray-500">No Image</p>
                )}
              </div>
              <label htmlFor="uploadCategoryImage">
                <div
                  className={`px-4 py-2 rounded border font-medium transition cursor-pointer 
                  ${!data.name ? 'bg-gray-300 cursor-not-allowed' : 'border-green-500 hover:bg-green-100 text-green-700'}`}
                >
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadCategoryImage"
                  onChange={handleUploadCategoryImage}
                  disabled={!data.name}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !(data.name && data.image)}
            className={`w-full py-2 rounded font-semibold text-white transition-all
              ${data.name && data.image ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {loading ? 'Uploading...' : 'Add Category'}
          </button>
        </form>

        {/* Custom placeholder font size */}
        <style jsx>{`
          input::placeholder {
            font-size: 0.75rem;
          }
        `}</style>
      </div>
    </section>
  );
};

export default UploadCategoryModel;
