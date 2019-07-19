const express = require('express');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const router = express.Router();

const Interesse = require('../models/interesse');

router.get('/', ensureLogin.ensureLoggedIn(), (req, res) => {
  Interesse.find()
  .then(interesses => {
    res.render('interesse/index', { interesses, user: req.user});
  })
  .catch(err => console.log(err));
});

router.get('/new', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('interesse/new', { user: req.user});
});

router.get('/edit/:id', ensureLogin.ensureLoggedIn(), (req, res) => {
  let {id} = req.params;
  Interesse.findById(id)
  .then(interesse => {
    res.render('interesse/edit', { interesse, user: req.user});
  })
  .catch(err => console.log(err));
});

router.post('/edit/:id', (req, res) => {
  let {id} = req.params;
  let {tipo, aeroportos} = req.body;
  let airports = aeroportos.split(',');
  Interesse.update({_id: id}, {tipo: tipo, airports: airports})
  .then(() => {
    res.redirect('/interesse');
  })
  .catch(err => console.log(err));
});

router.get('/delete/:id', (req, res) => {
  let {id} = req.params;
  Interesse.findByIdAndRemove(id)
  .then(() => {
    res.redirect('/interesse');
  })
  .catch(err => console.log(err));
});

router.post('/new', (req, res) => {
  let { tipo, aeroportos } = req.body;
  let airports = aeroportos.split(',');
  const interesse = new Interesse({tipo, airports})
  interesse.save()
  .then(() => {
    res.redirect('/interesse');
  })
  .catch(err => console.log(err))
});

module.exports = router;
