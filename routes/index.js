const express = require('express');
const router = express.Router();

const Interesse = require('../models/interesse');

router.get('/', (req, res) => {
  Interesse.find()
    .then(result => {
      res.render('main/search', {
        result
      });
    })
    .catch(err => console.log(err));
});

module.exports = router;
