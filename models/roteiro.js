const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const roteiroSchema = new Schema({
  custoTotal: Number,
  origem: String,
  destino: String,
  diaIda: String,
  diaVolta: String,
  hotel: {
    nomeHotel: String,
    custoDiarias: Number,
    estrelas: Number,
    rating: String,
    reviews: Number,
    cidade: String,
    foto: String,
    linkAcesso: String,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Roteiro = mongoose.model('Roteiro', roteiroSchema);
module.exports = Roteiro;