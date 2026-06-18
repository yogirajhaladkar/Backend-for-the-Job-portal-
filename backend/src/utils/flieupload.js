import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Config for the cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: procces.env.CLOUDINARY_API_SECRET
});

const uploadFileONCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
    })
    console.log("file is uploaded on the cloudinary")
    response.url
    return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
    }

}

