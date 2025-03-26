const Image = require("../models/Image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelpers");
const fs = require("fs");
const { log } = require("console");

const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required.",
      });
    }

    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // store id and url in db
    const newImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newImage.save();

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      image: newImage,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

const fetchImagesController = async (req, res) => {
  try {
    const images = await Image.find({});
    if (images) {
      res.status(200).json({
        success: true,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

const fetchImagesByUserController = async (req, res) => {
  if (req.params.userId) {
    try {
      const images = await Image.find({ uploadedBy: req.params.userId });
      if (images) {
        res.status(200).json({
          success: true,
          data: images,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    }
  } else {
    res.status(500).json({
      success: false,
      message: "User id invalid. Please try again.",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImagesController,
  fetchImagesByUserController,
};
