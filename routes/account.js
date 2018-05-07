// account.js
'use strict';

const express = require('express');
const router = express.Router();
const accountController = require('../models/account');
const passport = require('passport');

/** 회원가입 **/
router.get('/join', function(req, res) {
    var sess = req.session;
    res.render('index', {pages : 'join.ejs', sess : sess, models : {title : '회원가입', page_title : '회원가입'}});
});

router.post('/join', accountController.join);

/** 로그인 **/
router.get('/login', function(req, res) {
    var sess = req.session;
    res.render('index', {pages : 'login.ejs', sess: sess, models : {title : '로그인', page_title : '로그인'}});
});

router.post('/login', accountController.login);

/** 쿼리 테스트 **/
router.post('/query', accountController.query);
/** 이벤트로그 일괄제거 **/
// router.delete('/deleteEventLog', dbController.deleteEventLog);

module.exports = router;
