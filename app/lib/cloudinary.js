import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "[REDACTED]" : undefined,
});

export async function uploadImage(file) {
  try {
    // Validate file
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file: Expected a File object");
    }

    // Convert File to base64 data URL
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "pet-adoption",
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error in uploadImage:", error.message);
    throw new Error("Image upload failed");
  }
}
