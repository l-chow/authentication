const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  // check that token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided. Please log in.",
    });
  }

  // check that token is valid
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo);

    req.userInfo = decodedTokenInfo;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to verify bearer token.",
    });
  }
};

const adminMiddleware = (req, res, next) => {
  // check that user is an admin
  const { role } = req.userInfo;
  console.log(role);

  if (role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "You must be an admin to access this page.",
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
