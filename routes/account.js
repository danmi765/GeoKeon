// account.js
'use strict';

const express = require('express');
const router = express.Router();
const accountController = require('../models/account');

/** 회원가입 **/
router.post('/addUser', accountController.addUser);
/** 로그인 **/
router.post('/login', accountController.login);
/** 쿼리 테스트 **/
router.post('/query', accountController.query);
/** 이벤트로그 일괄제거 **/
// router.delete('/deleteEventLog', dbController.deleteEventLog);

module.exports = router;
