/**
 * Express Router Configuration.
 *
 * This module sets up an Express router to handle API routes.
 * It imports and integrates routes from the `routes` directory.
 *
 * @module router
 *
 * @requires express - A fast web framework for Node.js.
 * @requires ./routes/index.js - The main entry point for application routes.
 *
 * @constant {express.Router} router - Configured Express router instance.
 *
 * @example
 * import router from './router/index.js';
 * app.use('/api', router);
 */
import express from "express";
const router = express.Router();
import routes from "./routes/index.js";

// Use API Routes
router.use("/", routes);

export default router;


