module.exports = {
    port: process.env.PORT || 5000,
    corsOptions: {
        origin: "*", // Allow all origins (change this for security)
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // Allow cookies/auth headers if needed
    },
};
  