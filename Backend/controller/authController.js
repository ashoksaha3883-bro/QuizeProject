const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../modals/User");
const asyncHandler = require("../utils/asyncHandler");

const COOKIE_NAME = "quizcraft_token";
const COOKIE_AGE = 7 * 24 * 60 * 60 * 1000;

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
});

const setAuthCookie = (res, userId) => {
  const token = jwt.sign(
    { userId: String(userId) },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie(COOKIE_NAME, token, {
    ...cookieOptions(),
    maxAge: COOKIE_AGE,
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());
};

const publicUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// REGISTER
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required.",
    });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName.length < 2 || cleanName.length > 60) {
    return res.status(400).json({
      success: false,
      message: "Name must contain 2 to 60 characters.",
    });
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!validEmail.test(cleanEmail)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  if (
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters and no more than 72 UTF-8 bytes.",
    });
  }

  const existingUser = await User.findOne({
    email: cleanEmail,
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists.",
    });
  }

  // Hash the password before saving it.
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    // role intentionally omitted: defaults to "user"
  });

  setAuthCookie(res, user._id);

  return res.status(201).json({
    success: true,
    message: "Account created successfully.",
    user: publicUser(user),
  });
});

// LOGIN
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: cleanEmail,
  }).select("+passwordHash");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  setAuthCookie(res, user._id);

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    user: publicUser(user),
  });
});

// LOGOUT
const logout = (req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

// CURRENT USER
const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    user: publicUser(req.user),
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};