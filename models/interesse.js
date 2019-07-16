const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const interesseSchema = new Schema({
  tipo: String,
  airports: [String],
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Interesse = mongoose.model('Interesse', interesseSchema);
module.exports = Interesse;