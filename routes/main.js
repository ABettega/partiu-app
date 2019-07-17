const express = require('express');
const router = express.Router();
const API = require('../config/API');
const api = new API();
const async = require('async');
const Interesse = require('../models/interesse');
const Currency = require('../config/currency');
const apiCurrency = new Currency();

router.get('/main', (req, res) => {
  Interesse.find()
  .then(result => {
    res.render('main/search', { result });
  })
  .catch(err => console.log(err));
});

router.get('/main/result', (req, res) => {
  // const itins = req.query;
  res.render('main/result');
  
});

router.post('/main', (req, res) => {
  let {budget, dataIda, dataVolta, interesse} = req.body;

  let arrDestinos = [];
  let arrVoltas = [];
  let arrVoos = [];
  let arrFunc = [];
  let arrVoosVolta = [];
  let itins = [];

  Interesse.find({tipo: {$eq: interesse}})
  .then(result => {
    arrDestinos = result[0].airports;
    arrVoltas = result[0].airports;

    arrDestinos.forEach(e => {
      arrFunc.push((callback) => {
        api.get(e, 'GRU', dataIda)
        .then(result => {
          arrVoos.push(result);
          callback();
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
        arrVoos.sort((a, b) => {a.to.localeCompare(b.to)});
        arrVoosVolta.sort((a, b) => {a.from.localeCompare(b.from)});
        for (let i = 0; i < arrVoos.length; i += 1) {
          let vooIda = arrVoos[i];
          let vooVolta = arrVoosVolta[i];
          if (vooIda !== undefined && vooVolta !== undefined) {
            let itin = {ida: vooIda, volta: vooVolta};
            itins.push(itin);
          }
        }
        apiCurrency.getBRL()
        .then(result => {
          itins.forEach(itin => {
            let rate = parseFloat(result).toFixed(2);
            console.log(rate)
            let precoIda = parseFloat(itin.ida.price * rate).toFixed(2);
            let precoVolta = parseFloat(itin.volta.price * rate).toFixed(2);
            itin.ida.price = precoIda;
            itin.volta.price = precoVolta;
            console.log(`Preço ida novo: ${itin.ida.price} Preço volta novo: ${itin.volta.price} `)
          })
          res.render('main');
        })
        .catch(err => console.log(err));
      });
    }];
    async.series(arrFunc2);
  })
  .catch(err => console.log(err));
});

module.exports = router;
