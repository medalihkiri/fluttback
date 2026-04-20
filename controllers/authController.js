const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendResetEmail } = require('../services/mailService');

exports.register = async (req, res) => {
  try {
    const { name, firstname, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, firstname, email, password });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, firstname: user.firstname } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, firstname: user.firstname, avatar_url: user.avatar_url } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    
    // Save token and expiry (10 minutes)
    user.reset_code = resetToken;
    user.reset_code_expires = Date.now() + 600000; 
    await user.save();
    
    const emailSent = await sendResetEmail(email, resetToken);
    
    if (emailSent) {
      res.json({ message: 'Password reset code sent to your email' });
    } else {
      res.status(500).json({ message: 'Error sending email. Please check server configuration.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.reset_code || user.reset_code !== code) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    if (Date.now() > user.reset_code_expires) {
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset code
    user.reset_code = undefined;
    user.reset_code_expires = undefined;
    
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
