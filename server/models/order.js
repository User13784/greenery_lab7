const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Ссылка на другую коллекцию (аналог внешнего ключа)
  pharmacy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pharmacy', 
    required: true 
  },
  createdDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);