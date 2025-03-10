const mongoose = require("mongoose");
const { hashing } = require("../../utils");

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
  },
  { timestamps: true }
);

// Hash password only when it's modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashing.hashPassword(this.password); // Use hashing function
  next();
});

// Add a method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await hashing.comparePassword(enteredPassword, this.password);
};

// Add a virtual field for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
