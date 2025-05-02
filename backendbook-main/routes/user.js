const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../routes/userAuth");


// Sign up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    if (username.length < 4) {
      return res.status(400).json({ message: "Username must be at least 4 characters long" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length <= 5) {
      return res.status(400).json({ message: "Password must be more than 5 characters" });
    }

    const hashpass = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashpass,
      address,
    });

    await newUser.save();
    return res.status(200).json({ message: "Signup successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sign in
router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (!existingEmail) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, existingEmail.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const authClaims = {
      id: existingEmail._id,
      name: existingEmail.username,
      role: existingEmail.role,
    };

    const token = jwt.sign(authClaims, "bookStore123", { expiresIn: "30d" });

    return res.status(200).json({
      id: existingEmail._id,
      role: existingEmail.role,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get user information
router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;

    const data = await User.findById(id);
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update address
router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { address } = req.body;

    await User.findByIdAndUpdate(id, { address });

    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
