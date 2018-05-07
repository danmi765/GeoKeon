
/* ■■■■■ passport 관련 세팅 ■■■■■ */
const passport = require('passport') //passport module add
  , LocalStrategy = require('passport-local').Strategy;
const session = require('espress-session');

passport.use(new LocalStrategy({
        usernameField : 'user_id',
        passwordField : 'user_pw',
        passReqToCallback : true
    }
    ,function(req,user_id, user_pw, done) {
        if(userid=='hello' && password=='world'){
            var user = { 'userid':'hello',
                          'email':'hello@world.com'};
            return done(null,user);
        }else{
            return done(null,false);
        }
    }
));


/* ■■■■■ passport 관련 세팅 끝 ■■■■■ */




const bcrypt = require('bcrypt-nodejs');

//password를 암호화
exports.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
//password의 유효성 검증
exports.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
