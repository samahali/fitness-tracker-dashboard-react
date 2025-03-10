const mongoose = require("mongoose");

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

module.exports = AuthToken;
