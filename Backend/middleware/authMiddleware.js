const jwt = require("jsonwebtoken");
const User = require("../modals/User");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.quizcraft_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please log in to access this resource.",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Your session is invalid or expired. Please log in again.",
    });
  }

  const user = await User.findById(decoded.userId).select(
    "name email role createdAt"
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User account not found. Please log in again.",
    });
  }

  // Attach the authenticated user to the request.
  req.user = user;

  next();
});

// Restrict routes to selected roles.
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};