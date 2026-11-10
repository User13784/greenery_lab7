const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Название обязательно'], 
    minlength: [2, 'Слишком короткое название'] 
  },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  photoUrl: { type: String, default: '/photos/pharmacy1.jpg' },
}, { timestamps: true }); // timestamps добавляет createdAt и updatedAt

module.exports = mongoose.model('Pharmacy', pharmacySchema);