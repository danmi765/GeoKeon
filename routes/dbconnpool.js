// dbconnpool.js
'use strict';

const express = require('express');
const router = express.Router();
const dbconnPoolController = require('../models/dbconnpool');

/** DB pool 연결 추가 **/
router.post('/addPool', dbconnPoolController.dbpool);
/** DB pool getConnection**/
router.post('/dbpoolgetconnection', dbconnPoolController.dbpoolgetconnection);
/** DB pool release **/
router.post('/dbpoolforceend', dbconnPoolController.dbpoolforceend);

module.exports = router;
