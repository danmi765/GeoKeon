// account.js
'use strict';

const express = require('express');
const router = express.Router();
const accountController = require('../models/account');
const passport = require('passport');

/** 회원가입 **/
router.get('/join', accountController.joinPage);
router.post('/join', accountController.join);

/** 로그인 **/
router.get('/login', function(req, res){
    res.render('index', {pages : 'login.ejs', models : {title : '로그인', page_title : '로그인'}});
});
router.get('/loginPage', accountController.loginPage);
router.post('/login', accountController.login);

/**  로그아웃  **/
router.get('/logout', function(req, res) {
    delete req.session[req.session.authId];
    delete req.session.authId;
	req.session.save(function(){
		res.redirect('/');
    });    
});

/** 아이디 중복체크 **/
 router.post('/idCheck', accountController.checkid);

/** 아이디, 비밀번호 찾기 **/
 router.get('/findIdPage', accountController.findIdPage );
 router.post('/findId', accountController.findId );
 router.get('/findPwPage',accountController.findPwPage);
 router.post('/findPw',accountController.findPw);

 /** 마이페이지 **/
 router.get('/mypage', accountController.mypage );
 router.post('/mypage',accountController.myInfoPage);
 router.get('/myModi',accountController.myModiPage );
 router.get('/changePwPage', accountController.changePwPage );
 router.post('/changePw', accountController.changePw );

/** 쿼리 테스트 **/
router.post('/query', accountController.query);
/** 이벤트로그 일괄제거 **/
// router.delete('/deleteEventLog', dbController.deleteEventLog);

module.exports = router;
