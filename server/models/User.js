const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email обязателен'], 
    unique: true,
    lowercase: true
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);