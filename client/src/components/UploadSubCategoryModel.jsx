import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';

const UploadSubCategoryModel = ({ close, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    name: "",
    image: "",
    category: []
  });
  const [allCategories, setAllCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const response = await uploadImage(file);
      setSubCategoryData((prev) => ({
        ...prev,
        image: response.data.data.secure_url
      }));
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const fetchAllCategories = async () => {
    try {
      const response = await Axios(SummaryApi.getCategory);
      if (response.data.success) {
        setAllCategories(response.data.data);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const handleRemoveCategorySelected = (categoryId) => {
    const updated = subCategoryData.category.filter(cat => cat._id !== categoryId);
    setSubCategoryData(prev => ({ ...prev, category: updated }));
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...subCategoryData,
        category: subCategoryData.category.map(cat => cat._id)
      };
      const response = await Axios({
        ...SummaryApi.createSubCategory,
        data: dataToSend
      });
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        close && close();
        fetchData && fetchData();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 bg-neutral-800 bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-xl w-full rounded shadow-md p-6 text-gray-800 font-medium">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Sub Category</h2>
          <button onClick={close} className="text-gray-500 hover:text-black">
            <IoClose size={24} />
          </button>
        </div>

        <form className="grid gap-5 text-sm" onSubmit={handleSubmitSubCategory}>
          {/* Name */}
          <div className="grid gap-1">
            <label htmlFor="name" className="font-semibold">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter subcategory name"
              value={subCategoryData.name}
              onChange={handleChange}
              className="p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500"
              style={{ fontSize: '0.875rem' }}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="grid gap-1">
            <label className="font-semibold">Image</label>
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="border bg-gray-100 h-36 w-full lg:w-36 flex items-center justify-center rounded overflow-hidden">
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt="subCategory"
                    className="object-scale-down w-full h-full"
                  />
                ) : (
                  <p className="text-sm text-gray-500">No Image</p>
                )}
              </div>
              <label htmlFor="uploadSubCategoryImage">
                <div
                  className={`px-4 py-2 border font-medium rounded cursor-pointer transition 
                  ${!subCategoryData.name ? "bg-gray-300" : "border-green-500 hover:bg-green-100 text-green-700"}`}
                >
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  onChange={handleUploadSubCategoryImage}
                  className="hidden"
                  disabled={!subCategoryData.name}
                />
              </label>
            </div>
          </div>

          {/* Category Selector */}
          <div className="grid gap-1">
            <label className="font-semibold">Select Category</label>
            <div className="border border-gray-300 rounded p-2">
              <div className="flex flex-wrap gap-2 mb-2">
                {subCategoryData.category.map((cat) => (
                  <div key={cat._id} className="bg-white border px-2 py-1 rounded flex items-center gap-1 text-sm shadow-sm">
                    {cat.name}
                    <IoClose
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveCategorySelected(cat._id)}
                    />
                  </div>
                ))}
              </div>
              <select
                onChange={(e) => {
                  const selected = allCategories.find(cat => cat._id === e.target.value);
                  if (selected && !subCategoryData.category.some(c => c._id === selected._id)) {
                    setSubCategoryData(prev => ({
                      ...prev,
                      category: [...prev.category, selected]
                    }));
                  }
                }}
                className="w-full p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 text-sm"
              >
                <option value="">Select Category</option>
                {allCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!subCategoryData.name || !subCategoryData.image || subCategoryData.category.length === 0}
            className={`py-2 w-full rounded font-semibold text-white transition-all
              ${subCategoryData.name && subCategoryData.image && subCategoryData.category.length
                ? "bg-green-700 hover:bg-green-800"
                : "bg-gray-400 cursor-not-allowed"}`}
          >
            Submit
          </button>
        </form>

        {/* Style placeholder font */}
        <style jsx>{`
          input::placeholder {
            font-size: 0.75rem;
          }
        `}</style>
      </div>
    </section>
  );
};

export default UploadSubCategoryModel;
