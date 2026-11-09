const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.header('Authorization');
    
    // 2. Check if header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Please login first.' });
    }

    // 3. Extract the token (the part after 'Bearer ')
    const token = authHeader.split(' ')[1];

    // 4. Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Attach the user ID from the token payload to the request object
    req.userId = decoded.userId;
    
    next();
  } catch (err) {
    // Handle invalid or expired tokens
    res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
  }
};