const express = require('express');
const router = express.Router();
const checkRole = require('../middleware/checkRole');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Debugging: Print When Register Route is Loaded
console.log("✅ Register Route Loaded");

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Basic validation (role is optional)
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Validate role if provided
    if (role && !['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Prevent self-assigning admin role
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin role cannot be self-assigned' });
    }

    // Create user with optional role (defaults to 'user')
    const user = new User({ email, password, role: role || 'user' });
    await user.save();

    res.status(201).json({
      message: 'User created',
      user: { id: user._id, email: user.email, role: user.role }
    });

  } catch (error) {
    // Handle duplicate email
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login Route (Keeping existing code + Adding refresh token)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("✅ Login Attempt:", { email });

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password does not match for:", email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate Access Token (Existing code)
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    console.log("✅ Login successful. Token generated:", token);

    // Generate Refresh Token (New Addition)
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Store refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ 
      accessToken:token,  // Existing access token
      refreshToken  // New refresh token
    });

  } catch (error) {
    console.error("❌ Error in login route:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Protected Route (Keeping Existing Code)
router.get('/protected', require('../middleware/auth'), (req, res) => {
  res.json({ message: 'Protected route accessed', userId: req.userId });
});

// ✅ Admin Route (NEW)
router.get('/admin', 
  require('../middleware/auth'), 
  checkRole(['admin']), 
  (req, res) => {
    res.json({ message: 'Admin dashboard' });
  }
);
// ✅ Refresh Token Endpoint (New Addition)
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and validate stored token
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    console.error("❌ Refresh token error:", error);  // Added logging
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// ✅ Logout Endpoint (New Addition)
router.post('/logout', require('../middleware/auth'), async (req, res) => {
  try {
    console.log("🔹 Logout Attempt by User ID:", req.userId); // Debugging log
    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      console.log("❌ User not found in DB for ID:", req.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Log the existing refresh token before removal
    console.log("🔹 Before Logout: User Refresh Token:", user.refreshToken);

    // Remove refresh token from DB
    await User.findByIdAndUpdate(req.userId, { refreshToken: null });

    // Confirm removal by fetching the user again
    const updatedUser = await User.findById(req.userId);
    console.log("✅ After Logout: Refresh Token Removed. Current Value:", updatedUser.refreshToken);

    res.json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error("❌ Error in Logout:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
