const express = require('express');
const router = express.Router();

const Interesse = require('../models/interesse');

router.get('/', (req, res) => {
  Interesse.find()
  .then(interesses => {
    console.log(interesses);
    res.render('interesse/index', { interesses });
  })
  .catch(err => console.log(err));
});

router.get('/new', (req, res) => {
  res.render('interesse/new');
});

router.get('/edit/:id', (req, res) => {
  let {id} = req.params;
  Interesse.findById(id)
  .then(interesse => {
    res.render('interesse/edit', interesse);
  })
  .catch(err => console.log(err));
});

//User.update({_id: result[0]._id}, {status: true})

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
