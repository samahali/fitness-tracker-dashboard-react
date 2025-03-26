/**
 * Server Configuration.
 *
 * This module defines and exports server-related configurations, including
 * the port number and CORS settings.
 *
 * @module serverConfig
 *
 * @constant {number} port - The port number on which the server runs, retrieved from environment variables or defaults to 5000.
 * @constant {Object} corsOptions - Configuration settings for Cross-Origin Resource Sharing (CORS).
 * @property {string} corsOptions.origin - Specifies allowed origins (`*` allows all, modify for security).
 * @property {string} corsOptions.methods - Defines HTTP methods allowed in CORS requests.
 * @property {boolean} corsOptions.credentials - Indicates whether credentials (cookies, authentication headers) are allowed.
 *
 * @example
 * import { port, corsOptions } from "./config/server.config.js";
 * app.use(cors(corsOptions));
 * app.listen(port, () => console.log(`Server running on port ${port}`));
 */
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: "*", // Allow all origins (change this for security)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies/auth headers if needed
};

export { port, corsOptions };
