const express = require('express');
const router = express.Router();
const API = require('../config/API');
const api = new API();
const async = require('async');

const Interesse = require('../models/interesse');

router.get('/main', (req, res) => {
  Interesse.find()
  .then(result => {
    res.render('main/search', { result });
  })
  .catch(err => console.log(err));
});

router.post('/main', (req, res) => {
  let {budget, dataIda, interesse} = req.body;

  let arrDestinos = [];
  let arrVoos = [];
  let arrFunc = [];

  Interesse.find({tipo: {$eq: interesse}})
  .then(result => {
    arrDestinos = result[0].airports;

    arrDestinos.forEach(e => {
      arrFunc.push((callback) => {
        api.get(e, dataIda)
        .then(result => {
          arrVoos.push(result);
          callback();
        })
        .catch(err => console.log(err));      
      })
    });

    let arrFunc2 = [function () {
      async.parallel(arrFunc, () => {
        console.log(arrVoos)
        res.redirect('/main');
      });
    }];

    async.series(arrFunc2, function () {
      console.log(arrVoos);
    })
  })
  .catch(err => console.log(err));
});

module.exports = router;
