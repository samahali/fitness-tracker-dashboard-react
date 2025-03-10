const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
      error: true,
      message: err.message || "Internal Server Error",
    });
  };
  
  module.exports = errorMiddleware;
  