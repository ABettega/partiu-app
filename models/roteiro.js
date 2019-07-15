const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const roteiroSchema = new Schema({
  cost: Number,
  legs: [{
    departure: String,
    arrival: String,
    from: String,
    to: String,
    airline: String
  }],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Roteiro = mongoose.model('Roteiro', roteiroSchema);
module.exports = Roteiro;