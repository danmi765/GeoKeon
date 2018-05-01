/* commboard.js
* 커뮤니티 게시판
*/
'use strict';

const express = require('express');
const router = express.Router();
const commBoardController = require('../models/commboard');

/** 게시판 리스트 보기 **/
router.get('/comm/:commName', commBoardController.list);
/** 게시판 글 보기 **/
router.get('/comm_view/:commId', commBoardController.getComm);
/** 게시판 글쓰기 페이지 **/
router.get('/comm_write', commBoardController.writePage);
/** 게시판 글쓰기 **/
router.post('/comm_write', commBoardController.write);
/** 게시판 글수정하기 페이지 **/
router.get('/comm_modify/:commId', commBoardController.modifyPage);
/** 게시판 글수정하기 **/
// router.put('/comm_modify/:commId', commBoardController.modify);
/** 게시판 글삭제하기 **/
router.delete('/comm_remove/:commId', commBoardController.remove);

module.exports = router;
