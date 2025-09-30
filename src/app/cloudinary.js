import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Upload Image con optimización
const cloudinaryUploadImage = async (fileToUpload) => {
    try {
      const data = await cloudinary.uploader.upload(fileToUpload, {
        resource_type: "auto",
        transformation: [
          { width: 1000, crop: "scale" },
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Error (cloudinary)");
    }
};

// Cloudinary Remove Image
const cloudinaryRemoveImage = async (imagePublicId) => {
    try {
      const result = await cloudinary.uploader.destroy(imagePublicId);
      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Error (cloudinary)");
    }
};

// Cloudinary Remove Multiple Images
const cloudinaryRemoveMultipleImage = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error (cloudinary)");
  }
};

export {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  cloudinaryRemoveMultipleImage
};

export default cloudinary;