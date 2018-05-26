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
router.get('/comm_view/:commName&:commId', commBoardController.getComm);
/** 게시판 글쓰기 페이지 **/
router.get('/comm_write/:commName', commBoardController.writePage);
/** 게시판 글쓰기 **/
router.post('/comm_write/:commName', commBoardController.write);
/** 게시판 글수정하기 페이지 **/
router.get('/comm_modify/:commName&:commId', commBoardController.modifyPage);
/** 게시판 글수정하기 **/
router.post('/comm_modify/:commName&:commId', commBoardController.modify);
/** 게시판 글삭제하기 **/
router.post('/comm_remove/:commName&:commId', commBoardController.remove);
/** 게시판 글 검색하기 **/
router.post('/comm_remove/:commName&:commId', commBoardController.remove);

module.exports = router;
