const express = require("express");
const {userController} = require("../controllers");

const router = express.Router();

// Route for user registeration
router.post("/register", userController.createUser);

module.exports = router;