const express = require('express');
const router = express.Router();
const API = require('../config/API');
const api = new API();
const async = require('async');
const Interesse = require('../models/interesse');
const Roteiro = require('../models/roteiro');
const Currency = require('../config/currency');
const apiCurrency = new Currency();
const ensureLogin = require("connect-ensure-login");
const DateDiff = require('date-diff');

router.get('/main', (req, res) => {
  Interesse.find()
    .then(result => {
      res.render('main/search', {
        result
      });
    })
    .catch(err => console.log(err));
});


router.get('/test', (req, res, next) => {
  res.render('main/result-test');
});

router.post('/main/favorite', ensureLogin.ensureLoggedIn(), (req, res) => {
  let {
    itinCusto,
    itinDiaIda,
    itinDiaVolta,
    idaTo,
    idaFrom,
    hotel
  } = req.body;
  let hotelBanco = {
    nomeHotel: hotel.nomeHotel,
    custoDiarias: hotel.custoDiarias,
    estrelas: hotel.estrelas,
    rating: hotel.rating,
    reviews: hotel.reviews,
    cidade: hotel.cidade,
    foto: hotel.foto,
    linkAcesso: hotel.linkAcesso
  }
  let roteiro = new Roteiro({
    custoTotal: itinCusto,
    origem: idaFrom,
    destino: idaTo,
    diaIda: itinDiaIda,
    diaVolta: itinDiaVolta,
    hotel: hotelBanco
  });

  console.log('salvar no banco');

  res.redirect('/');
});

router.post('/main', (req, res) => {
  let {
    budget,
    dataIda,
    dataVolta,
    interesse
  } = req.body;

  let arrDestinos = [];
  let arrVoltas = [];
  let arrVoos = [];
  let arrHoteis = [];
  let arrFunc = [];
  let arrVoosVolta = [];
  let itins = [];

  Interesse.find({
      tipo: {
        $eq: interesse
      }
    })
    .then(result => {
      arrDestinos = result[0].airports;
      arrVoltas = result[0].airports;
      arrHoteis = [];

      arrDestinos.forEach(e => {
        arrFunc.push((callback) => {
          api.get(e, 'GRU', dataIda)
            .then(resultVoo => {
              api.getDestino(resultVoo, dataVolta)
                .then(result => {
                  api.getMelhorHotel(result)
                    .then(r => {
                      arrHoteis.push({
                        set: r,
                        to: e
                      });
                      arrVoos.push(resultVoo);
                      callback();
                    })
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
      });

      arrVoltas.forEach(e => {
        arrFunc.push((callback) => {
          api.get('GRU', e, dataVolta)
            .then(result => {
              arrVoosVolta.push(result);
              callback();
            })
            .catch(err => console.log(err));
        })
      });

      let arrFunc2 = [function () {
        async.parallel(arrFunc, () => {
          for (let i = 0; i < arrVoos.length; i += 1) {
            let vooIda = arrVoos[i];
            let vooVolta;
            arrVoosVolta.forEach(volta => {
              if (volta.from && vooIda.to === volta.from)
                vooVolta = volta;
            });
            if (vooIda !== undefined && vooVolta !== undefined) {
              let preco = vooIda.price + vooVolta.price;
              let diaIda = vooIda.legs[0].depart.split('T')[0];
              let diaVolta = vooVolta.legs[vooVolta.legs.length - 1].arrive.split('T')[0];

              let origem = verificarCidade(vooIda.legs[0].from)
              let destino = verificarCidade(vooIda.legs[vooIda.legs.length - 1].to)
              let itin = {
                id: i,
                ida: vooIda,
                volta: vooVolta,
                custo: preco,
                diaIda: diaIda,
                diaVolta: diaVolta,
                origem,
                destino,
                airline: vooIda.legs[0].airline
              };
              itins.push(itin);
            }
          }
          apiCurrency.getBRL()
            .then(result => {
              itins.forEach(itin => {
                let rate = parseFloat(result).toFixed(2);
                let precoIda = parseFloat(itin.ida.price * rate).toFixed(2);
                let precoVolta = parseFloat(itin.volta.price * rate).toFixed(2);
                let custoTotal = parseFloat(itin.custo * rate).toFixed(2);
                let custoChange = itin.custo * rate;
                itin.ida.price = precoIda;
                itin.volta.price = precoVolta;
                itin.custo = custoTotal;
                let valorRestante = budget - custoTotal;
                let voo1 = itin.ida['legs'];
                let voo2 = itin.volta['legs'];
                let ida = voo1[voo1.length - 1].arrive.split('T')[0].split('-');
                let volta = voo2[voo2.length - 1].depart.split('T')[0].split('-');
                itin.diaIda = ida[2] + '/' + ida[1] + '/' + ida[0];
                itin.diaVolta = volta[2] + '/' + volta[1] + '/' + volta[0];
                let data1 = new Date(ida[0], ida[1] - 1, ida[2]);
                let data2 = new Date(volta[0], volta[1] - 1, volta[2]);
                let diff = new DateDiff(data2, data1);
                let hotel = {}
                arrHoteis.forEach(hoteis => {
                  if (hoteis.set !== undefined && Array.isArray(hoteis.set) && hoteis.to === itin.ida.to) {
                    hoteis.set.forEach(h => {
                      let priceSemCifrao = h.price.split('$')[1];
                      let totalHotel = priceSemCifrao * result * diff.days();
                      if (totalHotel <= valorRestante && h.stars > 2 && h.stars <= 3) {
                        if (h.ratinglabel === 'Excellent' || h.ratinglabel === 'Good' || h.ratinglabel === 'Okay') {
                          if (hotel.reviews === undefined)
                            hotel.reviews = 0;
                          if (h.reviewcount > hotel.reviews) {
                            hotel.reviews = h.reviewcount;
                            hotel.linkAcesso = 'http://www.kayak.com' + h.shareURL;
                            hotel.foto = 'http://www.kayak.com' + h.thumburl;
                            hotel.nomeHotel = h.name;
                            hotel.cidade = h.city;
                            hotel.precoTotal = parseFloat(totalHotel).toLocaleString('pt-BR');
                            if (hoteis.ratinglabel === 'Excellent')
                              hotel.rating = 'Excelente'
                            else if (hoteis.ratinglabel === 'Good')
                              hotel.rating = 'Ótimo';
                            else
                              hotel.rating = 'Bom'
                            hotel.estrelas = h.stars;
                            itin.custoTotal = parseFloat(parseFloat(custoChange + totalHotel).toFixed(2)).toLocaleString('pt-BR');
                            itin.custoTotal = itin.custoTotal.replace('.', 'a');
                            itin.custoTotal = itin.custoTotal.replace(',', '.');
                            itin.custoTotal = itin.custoTotal.replace('a', ',');
                          }
                        }
                      }
                    });
                  }
                })
                itin.hotel = hotel;
              })
              res.render('main/result', {
                itins
              });
            })
            .catch(err => console.log(err));
        });
      }];
      async.series(arrFunc2);
    })
    .catch(err => console.log(err));
});
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});
function verificarCidade(airportCode) {
  let retorno = '';
  switch (airportCode) {
    case 'CWB':
      retorno = 'Curitiba, PR, Brasil'
      break;
    case 'HND':
      retorno = 'Tokyo, Japão'
      break;
    case 'CDG':
      retorno = 'Paris, França'
      break;
    case 'ATH':
      retorno = 'Atenas, Grécia'
      break;
    case 'FCO':
      retorno = 'Roma, Itália'
      break;
    case 'JFK':
      retorno = 'Nova York, NY, EUA'
      break;
    case 'PRG':
      retorno = 'Praga, Rep. Checa'
      break;
    case 'SVG':
      retorno = 'Stavanger, Noruega'
      break;
    case 'YYC':
      retorno = 'Calgary, Canadá'
      break;
    case 'FAT':
      retorno = 'Fresno, CA, EUA'
      break;
    case 'PHX':
      retorno = 'Phoenix, AZ, EUA'
      break;
    case 'BNE':
      retorno = 'Brisbane, Austrália'
      break;
    case 'UYU':
      retorno = 'Uyuni, Bolívia'
      break;
    case 'CAI':
      retorno = 'Cairo, Egito'
      break;
    case 'CUZ':
      retorno = 'Cuzco, Peru'
      break;
    case 'LHR':
      retorno = 'Londres, Inglaterra'
      break;
    case 'CNF':
      retorno = 'Belo Horizonte, MG, Brasil'
      break;
    case 'YYZ':
      retorno = 'Toronto, Canadá'
      break;
    case 'MCO':
      retorno = 'Orlando, FL, EUA'
      break;
    case 'MIA':
      retorno = 'Miami, FL, EUA'
      break;
    case 'USH':
      retorno = 'Ushuaia, Argentina'
      break;
    case 'IGU':
      retorno = 'Foz do Iguaçu, PR, Brasil'
      break;
    case 'SFO':
      retorno = 'São Francisco, CA, EUA'
      break;
    case 'ICN':
      retorno = 'Seul, Coréia do Sul'
      break;
    case 'BCN':
      retorno = 'Barcelona, Espanha'
      break;
    case 'EZE':
      retorno = 'Buenos Aires, Argentina'
      break;
    case 'BER':
      retorno = 'Berlim, Alemanha'
      break;
    case 'POA':
      retorno = 'Porto Alegre, RS, Brasil'
      break;
    case 'FOR':
      retorno = 'Fortaleza, CE, Brasil'
      break;
    case 'GIG':
      retorno = 'Angra dos Reis, RJ, Brasil'
      break;
    case 'FEN':
      retorno = 'Fernando de Noronha, RJ, Brasil'
      break;
    case 'REC':
      retorno = 'Recife, PE, Brasil'
      break;
    case 'MBJ':
      retorno = 'Negril, Jamaica'
      break;
    case 'OGG':
      retorno = 'Hawaii, HI, EUA'
      break;
    case 'SYD':
      retorno = 'Sydney, Austrália'
      break;
    case 'BKK':
      retorno = 'Bangkok, Tailândia'
      break;
    case 'DME':
      retorno = 'Moscou, Rússia'
      break;
    case 'JNB':
      retorno = 'Joanesburgo, África do Sul'
      break;
    case 'MSY':
      retorno = 'Nova Orleans, LA, EUA'
      break;
    case 'GRU':
      retorno = 'Guarulhos, SP, Brasil'
      break;
    default:
      retorno = 'Código não encontrado'
      break;
  }
  return retorno;
}

module.exports = router;