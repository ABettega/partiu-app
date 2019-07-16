const express = require('express');
const router = express.Router();
const axios = require('axios');
const API = require('../config/API');
const api = new API();

router.get('/main', (req, res) => {
  res.render('main/search');
});

router.post('/main', (req, res) => {
  let {budget, dataIda, interesse} = req.body;
  
  console.log(dataIda);

  api.get('SFO', dataIda)
  .then(result => {
    console.log(result);
    res.redirect('/main');
  })
  .catch(err => console.log(err));

});

module.exports = router;
