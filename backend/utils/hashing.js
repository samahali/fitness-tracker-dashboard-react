import bcrypt from "bcryptjs";

/**
 * Hash a plain text password
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} enteredPassword - The plain text password
 * @param {string} hashedPassword - The hashed password from the database
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

export { hashPassword, comparePassword };
