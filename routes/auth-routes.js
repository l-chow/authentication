const express = require("express");
const { registerUser, loginUser } = require("../controllers/auth-controller");
const router = express.Router();

// user authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
