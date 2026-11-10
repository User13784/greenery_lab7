const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  order: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  medicine: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Medicine', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: [1, 'Количество ≥ 1'] 
  },
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);