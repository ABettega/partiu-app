const express = require('express');
const router = express.Router();
const API = require('../config/API');
const api = new API();
const async = require('async');
const Interesse = require('../models/interesse');
const Currency = require('../config/currency');
const apiCurrency = new Currency();
let DateDiff = require('date-diff');

router.get('/main', (req, res) => {
  Interesse.find()
  .then(result => {
    res.render('main/search', { result });
  })
  .catch(err => console.log(err));
});

// router.post('/main/result', (req, res) => {
//   console.log(req.body);
//   const {itins} = req.body;
//   res.render('main/result', {itins});
  
// });

router.post('/main', (req, res) => {
  let {budget, dataIda, dataVolta, interesse} = req.body;

  let arrDestinos = [];
  let arrVoltas = [];
  let arrVoos = [];
  let arrHoteis = [];
  let arrFunc = [];
  let arrVoosVolta = [];
  let itins = [];

  Interesse.find({tipo: {$eq: interesse}})
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
            api.getMelhorHotel(result, dataIda, dataVolta)
            .then(r => {
              arrHoteis.push({set: r, to: e});
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
    // arrDestinos.forEach(e => {
    //   arrFunc.push((callback) => {
    //     api.get(e, 'GRU', dataIda)
    //     .then(result => {
    //       arrVoos.push(result);
    //       callback();
    //     })
    //     .catch(err => console.log(err));      
    //   })
    // });

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
        arrVoos.sort((a, b) => {a.to.localeCompare(b.to)});
        arrVoosVolta.sort((a, b) => {a.from.localeCompare(b.from)});
        for (let i = 0; i < arrVoos.length; i += 1) {
          let vooIda = arrVoos[i];
          let vooVolta = arrVoosVolta[i];
          if (vooIda !== undefined && vooVolta !== undefined) {
            let preco = vooIda.price + vooVolta.price;
            let itin = {ida: vooIda, volta: vooVolta, custo: preco};
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
            itin.ida.price = precoIda;
            itin.volta.price = precoVolta;
            itin.custo = custoTotal;
            let valorRestante = budget - custoTotal;
            let voo1 = itin.ida['legs'];
            let voo2 = itin.volta['legs'];
            let ida = voo1[voo1.length-1].arrive.split('T')[0].split('-');
            let volta = voo2[voo2.length-1].depart.split('T')[0].split('-');
            let data1 = new Date(ida[0], ida[1] - 1, ida[2]);
            let data2 = new Date(volta[0], volta[1] - 1, volta[2]);
            let diff = new DateDiff(data2, data1);
            let hotel = {}
            arrHoteis.forEach(hoteis => {
              if (hoteis.set !== undefined && Array.isArray(hoteis.set) && hoteis.to === itin.ida.to) {
                hoteis.set.forEach(h => {
                  let priceSemCifrao = h.price.split('$')[1];
                  let totalHotel = priceSemCifrao * result * diff.days();
                  if (totalHotel <= valorRestante) {
                    hotel.precoTotal = parseFloat(totalHotel).toFixed(2);
                    if (h.ratinglabel === 'Excellent' || h.ratinglabel === 'Good' || h.ratinglabel === 'Okay') {
                      if (h.reviewcount > hotel.reviews) {
                        hotel.reviews = h.reviewcount;
                        if (hoteis.ratinglabel === 'Excellent')
                          hotel.rating = 'Excelente'
                        else
                          hotel.rating = 'Bom';
                        hotel.estrelas = h.stars;
                      }
                    }
                  }
                });
              }
            })
            itin.hotel = hotel;
          })
          res.render('main/result', {itins});
        })
        .catch(err => console.log(err));
      });
    }];
    async.series(arrFunc2);
  })
  .catch(err => console.log(err));
});

module.exports = router;
