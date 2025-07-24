import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    // This now matches CLOUDINARY_CLOUD_NAME in your .env file
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    // This now matches CLOUDINARY_API_KEY in your .env file
    api_key: process.env.CLOUDINARY_API_KEY,

    // This now matches CLOUDINARY_API_SECRET in your .env file
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImageClodinary = async(image)=>{
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

    const uploadImage = await new Promise((resolve,reject)=>{
        cloudinary.uploader.upload_stream({ folder : "binkeyit"},(error,uploadResult)=>{
            return resolve(uploadResult)
        }).end(buffer)
    })

    return uploadImage
}

export default uploadImageClodinary
