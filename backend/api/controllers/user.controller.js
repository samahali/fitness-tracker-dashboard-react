const {User} = require("../models");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, weight, height } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create and save the new user (password hashing handled in model)
    const newUser = new User({ firstName, lastName, email, password, age, gender, weight, height });
    await newUser.save();

    // Remove password before sending response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

module.exports = { createUser };

