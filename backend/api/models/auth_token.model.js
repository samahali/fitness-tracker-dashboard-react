/**
 * Mongoose Schema for Authentication Tokens.
 *
 * This schema defines the structure for storing authentication tokens,
 * such as refresh tokens, associated with users. It includes fields for
 * user reference, token value, and expiration date.
 *
 * @module AuthToken
 *
 * @requires mongoose - MongoDB ODM for Node.js.
 *
 * @constant {mongoose.Schema} authTokenSchema - Schema definition for authentication tokens.
 *
 * @example
 * import AuthToken from './models/auth_token.model.js';
 * const token = new AuthToken({ user: userId, token: jwtToken, expiresAt: expiryDate });
 * await token.save();
 */
import mongoose from "mongoose";

const authTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // References the User model
      required: true,
    },
    token: {
      type: String,
      required: true, // JWT or refresh token
      unique: true, // Prevent duplicate tokens
    },
    expiresAt: {
      type: Date,
      required: true, // Expiry date for refresh tokens
      index: { expires: 0 }, // Auto-delete expired tokens
    },
  },
  { timestamps: true } // Automatically adds `createdAt` & `updatedAt`
);

const AuthToken = mongoose.model("AuthToken", authTokenSchema);

export default AuthToken;
