const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('main/search', {user: req.user});
});

module.exports = router;
