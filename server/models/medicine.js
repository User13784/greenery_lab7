const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Название обязательно'], 
    minlength: [2, 'Слишком короткое название'] 
  },
  manufacturer: { type: String, required: true },
  price: { 
    type: Number, 
    required: true, 
    min: [0, 'Цена не может быть отрицательной'] 
  },
  photoUrl: { type: String, default: '/photos/medicine1.jpg' },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);