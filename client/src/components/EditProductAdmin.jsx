import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux';
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
    _id: propsData._id,
    name: propsData.name,
    image: propsData.image,
    category: propsData.category,
    subCategory: propsData.subCategory,
    unit: propsData.unit,
    stock: propsData.stock,
    price: propsData.price,
    discount: propsData.discount,
    description: propsData.description,
    more_details: propsData.more_details || {},
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector(state => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector(state => state.product.allSubCategory);

  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: ImageResponse } = response;
    const imageUrl = ImageResponse.data.url;
    setData(prev => ({ ...prev, image: [...prev.image, imageUrl] }));
    setImageLoading(false);
  };

  const handleDeleteImage = (index) => {
    data.image.splice(index, 1);
    setData(prev => ({ ...prev }));
  };

  const handleRemoveCategory = (index) => {
    data.category.splice(index, 1);
    setData(prev => ({ ...prev }));
  };

  const handleRemoveSubCategory = (index) => {
    data.subCategory.splice(index, 1);
    setData(prev => ({ ...prev }));
  };

  const handleAddField = () => {
    setData(prev => ({
      ...prev,
      more_details: {
        ...prev.more_details,
        [fieldName]: ""
      }
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data
      });
      const { data: responseData } = response;
      if (responseData.success) {
        successAlert(responseData.message);
        if (close) close();
        fetchProductData();
        setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {},
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-70 z-50 p-4 overflow-auto">
      <div className="bg-white w-full max-w-2xl mx-auto rounded shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Product</h2>
          <button onClick={close} className="hover:text-red-500">
            <IoClose size={20} />
          </button>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="grid gap-1">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="p-2 bg-blue-50 border rounded placeholder-gray-500 text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={3}
              className="p-2 bg-blue-50 border rounded placeholder-gray-500 text-sm resize-none"
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div className="grid gap-2">
            <label className="text-sm font-medium">Image</label>
            <label htmlFor="productImage" className="border bg-blue-50 rounded flex items-center justify-center h-24 cursor-pointer">
              {imageLoading ? (
                <Loading />
              ) : (
                <div className="text-center">
                  <FaCloudUploadAlt size={30} className="mx-auto" />
                  <p className="text-xs">Upload Image</p>
                </div>
              )}
              <input
                type="file"
                id="productImage"
                className="hidden"
                accept="image/*"
                onChange={handleUploadImage}
              />
            </label>
            <div className="flex flex-wrap gap-3">
              {data.image.map((img, idx) => (
                <div key={img + idx} className="relative w-20 h-20 border bg-blue-50">
                  <img src={img} alt="product" className="w-full h-full object-scale-down" onClick={() => setViewImageURL(img)} />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleDeleteImage(idx)}
                  >
                    <MdDelete size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Remaining fields follow the same style... */}

          {/* Add Fields */}
          <div>
            <button
              type="button"
              onClick={() => setOpenAddField(true)}
              className="px-4 py-2 bg-white border border-green-500 text-green-600 rounded hover:bg-green-100 text-sm font-semibold"
            >
              + Add Field
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-semibold"
          >
            Update Product
          </button>
        </form>

        {/* View Image */}
        {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />}

        {/* Add Field Modal */}
        {openAddField && (
          <AddFieldComponent
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            submit={handleAddField}
            close={() => setOpenAddField(false)}
          />
        )}
      </div>
    </section>
  );
};

export default EditProductAdmin;