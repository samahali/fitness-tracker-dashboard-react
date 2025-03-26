/**
 * Mongoose Schema for Users.
 *
 * This schema defines the structure for storing user information,
 * including personal details, authentication credentials, and profile data.
 * It includes password hashing before saving and a method for password comparison.
 *
 * @module User
 *
 * @requires mongoose - MongoDB ODM for Node.js.
 * @requires ../../utils/index.js - Utility functions for password hashing and comparison.
 *
 * @constant {mongoose.Schema} userSchema - Schema definition for user data.
 *
 * @example
 * import User from './models/user.model.js';
 * const newUser = new User({ firstName: "John", lastName: "Doe", email: "john@example.com", password: "securepass" });
 * await newUser.save();
 */
import mongoose from "mongoose";
import { hashPassword, comparePassword } from "../../utils/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Prevents password from being returned in queries
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    },
    profileImage: { type: String }, // Store Cloudinary URL here
  },
  { timestamps: true }
);

// Hash password only when it's modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password); // Use hashing function
  next();
});

// Add a method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await comparePassword(enteredPassword, this.password);
};

// Add a virtual field for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSchema);
export default User;
