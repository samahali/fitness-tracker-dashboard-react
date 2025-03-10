module.exports = {
    jwtSecret: process.env.JWT_SECRET || "default_secret_key",
    jwtExpiresIn: "1h",
  };
  