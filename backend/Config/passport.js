const KakaoStrategy = require('passport-kakao').Strategy
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User');

module.exports = function(){
    passport.use(new KakaoStrategy({
        clientID : process.env.KAKAO_CLIENT_ID,  
        clientSecret: process.env.KAKAO_CLIENT_SECRET, 
        callbackURL : "https://example.com/oauth",
        profileFields : ['id',]
      },
      (accessToken, refreshToken, kakaoProfile, done) => {
        // 사용자의 정보는 profile에 들어있다.
        console.log(kakaoProfile)
        User.findOrCreate({ kakaoId: kakaoProfile.id}, (err, user) => {
          if (err) { return done(err) }
          return done(null, user)
        })
      }
    ))

    passport.serializeUser( (user,done) => {
        done(null, user.id);
    })

    passport.deserializeUser( (id,done) => {
        User.findById(id, (err, user) => {
            done(err,user);
        })
    })
}

