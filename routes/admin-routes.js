const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth-middleware");

router.get("/welcome", authMiddleware, adminMiddleware, (req, res) => {
  const { userId, username } = req.userInfo;
  res.status(200).json({
    success: true,
    message: "Welcome to the admin page.",
    user: {
      _id: userId,
      username,
    },
  });
});

module.exports = router;
