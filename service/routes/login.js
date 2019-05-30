const express = require('express');
const passport = require('passport');
const checkEmailAuth = require('../middlewares/checkEmailAuth');

const encrypto = require('../encryption');
var router = express.Router();

router.post( '/', passport.authenticate('local'),
  checkEmailAuth
);

router.get( '/check', function(req, res, next) {
  res.send(req.session.passport);
});

router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy((err)=>{
    console.log('로그아웃 되었습니다.');
  })
});


router.post('/changePw', (req, res, next) =>{
  let password = req.body.password;
  let marketerId = req.session.passport.user.userid;
  let key, salt;
  [key, salt] = encrypto.make(password);

  pool.getConnection(function(err, conn){
    if(err){ 
      console.log(err);
    }
    conn.query(`UPDATE marketerInfo SET marketerSalt = ?, marketerPasswd = ?, temporaryLogin = 0 WHERE marketerId = ? `, [salt, key, marketerId], function(err, result, fields){
      console.log('비밀번호 변경 성공');
      res.end();
    });
    conn.release();
  });
})

router.get("/twitch", passport.authenticate("twitch"));

router.get("/twitch/callback", passport.authenticate("twitch"),
  function(req, res, next){
    console.log('success in server');
    res.redirect("http://localhost:3001/dashboard/main");
  }
);

module.exports = router;