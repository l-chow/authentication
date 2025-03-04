const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    // check if username is taken
    const checkExistingUsername = await User.findOne({ username });
    if (checkExistingUsername) {
      return res.status(400).json({
        success: false,
        message:
          "User with existing username already exists. Please enter a new username.",
      });
    }
    const checkExistingEmail = await User.findOne({ email });
    if (checkExistingEmail) {
      return res.status(400).json({
        success: false,
        message:
          "User with existing email already exists. Please enter a new email.",
      });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
      role,
    });

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully.",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to register user. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to register user. Please try again.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }

    // hash pw to compare to db
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(404).json({
        success: false,
        message: "Password is invalid.",
      });
    }

    console.log(process.env.JWT_SECRET_KEY);

    // create bearer token: information about logged in user
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "Successfully logged in.",
      accessToken: accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to login. Please try again.",
    });
  }
};

module.exports = { registerUser, loginUser };
