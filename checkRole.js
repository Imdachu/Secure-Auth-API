const User = require('../models/User'); // Import the User model
module.exports = (allowedRoles) => {
    return (req, res, next) => {
      User.findById(req.userId)
        .then(user => {
          if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
          }
          next();
        })
        .catch(() => res.status(403).json({ message: 'Forbidden' }));
    };
  };