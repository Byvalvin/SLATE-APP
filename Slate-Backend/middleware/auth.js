// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }
a
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach userId to the request object
    next();  // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized access' });  // Token is invalid or expired
  }
};
