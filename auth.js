const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("❌ No Authorization Header or Incorrect Format");
    return res.status(401).json({ message: 'Authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    console.log("✅ Extracted userId from Token:", req.userId);
    next();
  } catch (error) {
    console.log("❌ Invalid or Expired Token");
    res.status(401).json({ message: 'Invalid token' });
  }
};
