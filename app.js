require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User'); // ✅ Added User model
const app = express();

// Middleware
app.use(express.json());

// Database Connection
// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed admin user AFTER connection
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('No admin found. Creating one...');
      const admin = new User({
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created');
    }
    else {
      console.log('Admin already exists:', adminExists.email);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

  // Import routes
const authRoutes = require('./routes/authRoutes');

// ✅ Debugging: Print Loaded Routes
console.log("Auth Routes:", authRoutes.stack?.map(r => r.route?.path) || "No routes found");

// Use auth routes
app.use('/api', authRoutes);

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Auth API Working');
});

// Start Server
const PORT = process.env.PORT || 3000;
console.log("Loaded Routes:", authRoutes.stack.map(r => r.route.path));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});