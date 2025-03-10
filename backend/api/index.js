const express = require("express");
const router = express.Router();
const routes = require("./routes");

// Use API Routes
router.use("/", routes);

module.exports = router;


