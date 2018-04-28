// dbconn.js
'use strict';

const express = require('express');
const router = express.Router();
const dbconnController = require('../models/dbconn');

/** DB 연결 추가 **/
router.post('/addConn', dbconnController.addConn);
/** DB 연결 해제 **/
router.post('/disConn', dbconnController.disConn);

module.exports = router;
