/**
 * Cloudinary Singleton Configuration.
 *
 * This module sets up and configures Cloudinary for handling image uploads.
 * It ensures the configuration runs only once and validates required environment variables.
 *
 * @module cloudinaryConfig
 *
 * @requires cloudinary - Cloud-based image and video storage service.
 * @requires dotenv - Loads environment variables from a `.env` file.
 *
 * @example
 * import cloudinaryInstance from './config/cloudinary.config.js';
 * const result = await cloudinaryInstance.uploader.upload('path/to/image.jpg');
 */
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

class CloudinarySingleton {
  constructor() {
    if (!CloudinarySingleton.instance) {
      this.init();
      CloudinarySingleton.instance = cloudinary; // Store the configured instance
    }
    return CloudinarySingleton.instance;
  }

  init() {
    // Validate required environment variables
    const requiredEnvVars = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
    const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

    if (missingVars.length > 0) {
      console.error(`Missing Cloudinary environment variables: ${missingVars.join(", ")}`);
      process.exit(1);
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    console.log("Cloudinary configured successfully.");
  }
}

// Export a **single instance** of Cloudinary
const cloudinaryInstance = new CloudinarySingleton();
export default cloudinaryInstance;
