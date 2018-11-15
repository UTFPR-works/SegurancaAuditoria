const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../db');
const openpgp = require('../public/javascripts/openpgp.js')
const util = require('../public/javascripts/util');

function authenticationMiddleware() {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login?fail=true')
  }
}

function authenticationLoginMiddleware() {
  return function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    }
    res.redirect('/chat')
  }
}

router.get('/', function (req, res, next) {
  res.render('login', { message: null });
});

router.get('/chat', authenticationMiddleware(), function (req, res) {
  util.user = req.user;
  console.log(util.user);
  let keyOptions = {
    userIds: [{ username: util.user.username, email: util.user.email }],
    numBits: 2048,
    passphrase: util.user.password
  };
  const fs = require('fs');
  var path = `C:/priv/${util.user.username}.priv`;

  fs.readFile(path, function (err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        openpgp.generateKey(keyOptions)
          .then((key) => {
            util.publicKey = key.publicKeyArmored;
            util.privateKey = key.privateKeyArmored;
            console.log('chaves geradas');
            // console.log(util.privateKey);
            // console.log(util.publicKey);
          }).then(() => {
            db.savePublicKey(util.user.email, util.publicKey, (err, result) => {
              console.log('saved public key');
            });
            fs.writeFile(path, util.privateKey, function (err) {
              if (err) {
                return console.log(err);
              }
            })
          });
      }
      console.log(err);
    } else {
      util.privateKey = data.toString();
      db.findPublicKey(util.user.email, function (err, result) {
        util.publicKey = result.publicKey;
        // console.log(util.publicKey);
        console.log('chave publica carregada');
      })
      console.log('chave privada carregada');

      // console.log(util.privateKey);
    }
  })

  res.render('chat');

});

router.get('/login', authenticationLoginMiddleware(), function (req, res) {
  if (req.query.fail)
    res.render('login', { message: 'Usuário e/ou senha incorretos!' });
  else
    res.render('login', { message: null });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/chat', failureRedirect: '/login?fail=true' })
);

router.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
