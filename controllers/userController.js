const User = require("../models/user");

// Landing Page (Login or Signup)
exports.landingPage = (req, res) => {
  res.render("landing");
};

// Render Signup Page
exports.getSignup = (req, res) => {
  res.render("signup");
};

// Handle Signup
exports.postSignup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("User already exists. Try logging in.");
    }
    
    const newUser = new User({ name, email, password });
    await newUser.save();
    
    res.redirect("/login");
  } catch (err) {
    res.status(500).send("Error signing up.");
  }
};

// Render Login Page
exports.getLogin = (req, res) => {
  res.render("login");
};

// Handle Login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.send("Invalid email or password");
    }

    // Store user in session
    req.session.user = user;
    res.redirect("/home");
  } catch (err) {
    res.status(500).send("Error logging in.");
  }
};

// Render Profile Page
exports.getProfile = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const user = await User.findById(req.session.user._id);
  res.render("profile", { user });
};

// Update Profile
exports.updateProfile = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { name, address } = req.body;
  await User.findByIdAndUpdate(req.session.user._id, { name, address });

  // Update session data
  req.session.user.name = name;
  req.session.user.address = address;

  res.redirect("/profile");
};
