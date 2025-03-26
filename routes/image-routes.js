const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/auth-middleware");
const multerMiddleware = require("../middleware/image-upload-middleware");
const {
  uploadImageController,
  fetchImagesController,
  fetchImagesByUserController,
} = require("../controllers/image-controller");

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  multerMiddleware.single("image"),
  uploadImageController
);

router.get("/", authMiddleware, fetchImagesController);
router.get("/:userId", authMiddleware, fetchImagesByUserController);

module.exports = router;
