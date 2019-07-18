const express = require("express");
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const router = express.Router();

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const User = require('../models/user')


router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});


router.post("/signup", (req, res, next) => {
  const { username, password, name, email, budget } = req.body;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const status = false;
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
        name,
        email,
        budget,
        status,
        confirmationCode: token
      });

      newUser.save((err) => {
        if (err) {
          res.render('auth/signup', { message: 'Something went wrong' });
        } else {
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/auth/profile',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true,
}));

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/auth/profile',
  failureRedirect: '/',
}));

router.get('/profile', ensureLogin.ensureLoggedIn(), (req, res) => {
  // console.log(req.user)
  res.render('auth/profile', { user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth/login');
});

module.exports = router;
