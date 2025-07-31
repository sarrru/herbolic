import React, { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import { useEffect } from 'react';

const UploadProduct = () => {
  const [data,setData] = useState({
      name : "",
      image : [],
      category : [],
      subCategory : [],
      unit : "",
      stock : "",
      price : "",
      discount : "",
      description : "",
      more_details : {},
  })
  const [imageLoading,setImageLoading] = useState(false)
  const [ViewImageURL,setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory,setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField,setOpenAddField] = useState(false)
  const [fieldName,setFieldName] = useState("")

  const handleChange = (e)=>{
    const { name, value} = e.target 
    setData((preve)=>({ ...preve, [name]: value }))
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]
    if(!file) return 
    setImageLoading(true)
    const response = await uploadImage(file)
    const { data : ImageResponse } = response
    const imageUrl = ImageResponse.data.url 
    setData((preve)=>({ ...preve, image : [...preve.image,imageUrl] }))
    setImageLoading(false)
  }

  const handleDeleteImage = async(index)=>{
      data.image.splice(index,1)
      setData((preve)=>({ ...preve }))
  }

  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>({ ...preve }))
  }

  const handleRemoveSubCategory = async(index)=>{
    data.subCategory.splice(index,1)
    setData((preve)=>({ ...preve }))
  }

  const handleAddField = ()=>{
    setData((preve)=>({
        ...preve,
        more_details : {
          ...preve.more_details,
          [fieldName] : ""
        }
    }))
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      const response = await Axios({ ...SummaryApi.createProduct, data })
      const { data : responseData} = response
      if(responseData.success){
          successAlert(responseData.message)
          setData({
            name : "",
            image : [],
            category : [],
            subCategory : [],
            unit : "",
            stock : "",
            price : "",
            discount : "",
            description : "",
            more_details : {},
          })
      }
    } catch (error) {
        AxiosToastError(error)
    }
  }

  return (
    <section className=''>
        <div className='p-2 bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold text-gray-800'>Upload Product</h2>
        </div>
        <div className='grid p-3 text-gray-800 font-medium'>
            <form className='grid gap-4 max-w-2xl' onSubmit={handleSubmit}>
                {['name', 'unit', 'stock', 'price', 'discount'].map(field => (
                  <div className='grid gap-1' key={field}>
                    <label htmlFor={field} className='text-sm font-semibold capitalize'>{field}</label>
                    <input 
                      id={field}
                      type={field === 'stock' || field === 'price' || field === 'discount' ? 'number' : 'text'}
                      placeholder={`Enter product ${field}`}
                      name={field}
                      value={data[field]}
                      onChange={handleChange}
                      required
                      className='p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500 text-sm'
                    />
                  </div>
                ))}

                <div className='grid gap-1'>
                  <label htmlFor='description' className='text-sm font-semibold'>Description</label>
                  <textarea
                    id='description'
                    placeholder='Enter product description'
                    name='description'
                    value={data.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className='p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500 text-sm resize-none'
                  />
                </div>

                <div>
                  <p className='text-sm font-semibold'>Image</p>
                  <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                      <div className='text-center flex justify-center items-center flex-col'>
                        {imageLoading ? <Loading/> : (<><FaCloudUploadAlt size={35}/><p>Upload Image</p></>)}
                      </div>
                      <input type='file' id='productImage' className='hidden' accept='image/*' onChange={handleUploadImage} />
                  </label>
                  <div className='flex flex-wrap gap-4 mt-2'>
                    {data.image.map((img,index) => (
                      <div key={img+index} className='h-20 w-20 bg-blue-50 border relative group'>
                        <img src={img} alt='preview' className='w-full h-full object-scale-down cursor-pointer' onClick={()=>setViewImageURL(img)} />
                        <div onClick={()=>handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 text-white hidden group-hover:block cursor-pointer rounded'>
                          <MdDelete/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {[{label: 'Category', state: 'category', options: allCategory, valueState: selectCategory, setter: setSelectCategory, remover: handleRemoveCategory}, {label: 'Sub Category', state: 'subCategory', options: allSubCategory, valueState: selectSubCategory, setter: setSelectSubCategory, remover: handleRemoveSubCategory}].map(({label, state, options, valueState, setter, remover}) => (
                  <div className='grid gap-1' key={state}>
                    <label className='text-sm font-semibold'>{label}</label>
                    <select
                      className='p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500 text-sm w-full'
                      value={valueState}
                      onChange={(e) => {
                        const val = e.target.value;
                        const selected = options.find(el => el._id === val);
                        if (selected) {
                          setData(prev => ({ ...prev, [state]: [...prev[state], selected] }));
                          setter("");
                        }
                      }}>
                      <option value=''>Select {label}</option>
                      {options.map(opt => (
                        <option value={opt._id} key={opt._id}>{opt.name}</option>
                      ))}
                    </select>
                    <div className='flex flex-wrap gap-2 mt-1'>
                      {data[state].map((item, idx) => (
                        <div key={item._id+idx} className='text-xs flex items-center gap-1 bg-blue-50 px-2 py-1 rounded'>
                          <p>{item.name}</p>
                          <IoClose size={16} className='cursor-pointer text-red-500' onClick={()=>remover(idx)} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {Object.keys(data.more_details).map((k, idx) => (
                  <div className='grid gap-1' key={k+idx}>
                    <label htmlFor={k} className='text-sm font-semibold'>{k}</label>
                    <input 
                      id={k}
                      type='text'
                      value={data.more_details[k]}
                      onChange={(e)=>setData(prev=>({ ...prev, more_details: { ...prev.more_details, [k]: e.target.value } }))}
                      required
                      className='p-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-green-500 placeholder-gray-500 text-sm'
                    />
                  </div>
                ))}

                <div onClick={()=>setOpenAddField(true)} className='bg-white border border-green-500 text-green-700 hover:bg-green-100 px-4 py-2 rounded cursor-pointer w-fit font-semibold text-sm'>
                  Add Fields
                </div>

                <button type='submit' className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold'>
                  Submit
                </button>
            </form>
        </div>

        {ViewImageURL && <ViewImage url={ViewImageURL} close={()=>setViewImageURL("")} />}
        {openAddField && <AddFieldComponent value={fieldName} onChange={(e)=>setFieldName(e.target.value)} submit={handleAddField} close={()=>setOpenAddField(false)} />}

        <style jsx>{`
          input::placeholder,
          textarea::placeholder {
            font-size: 0.75rem;
          }
        `}</style>
    </section>
  )
}

export default UploadProduct;
