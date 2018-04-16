/* commboard.js
* 커뮤니티 게시판
*/
'use strict';

const express = require('express');
const router = express.Router();
const commBoardController = require('../models/commboard');

/** 게시판 리스트 보기 **/
router.get('/list', commBoardController.list);
/** 게시판 글쓰기 **/
router.post('/write', commBoardController.write);
/** 게시판 글수정하기 **/
router.put('/modify', commBoardController.modify);
/** 게시판 글삭제하기 **/
router.delete('/remove', commBoardController.remove);

module.exports = router;
