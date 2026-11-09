const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Imported for JWT generation
const User = require('../models/User');

// Helper function to return the public user profile
const publicProfile = (u) => ({ _id: u._id, firstName: u.firstName, lastName: u.lastName, email: u.email });

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: 'Email already registered.' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hash });
    res.status(201).json(publicProfile(user));
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    
    // 1. Generate the JWT token (includes user ID, secret key, and 1-day expiration)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // 2. Send the token along with the user data to the frontend
    res.json({
      token, 
      user: publicProfile(user)
    });
  } catch (err) { next(err); }
};