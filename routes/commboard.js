/* commboard.js
* 커뮤니티 게시판
*/
'use strict';

const express = require('express');
const router = express.Router();
const commBoardController = require('../models/commboard');

/** 게시판 목록 리스트 불러오기 **/
router.get('/loadcommlist', commBoardController.loadcommlist);
/** 게시판 리스트 보기 & 검색하기 **/
router.get('/comm/:commName', commBoardController.list);
/** 게시판 글 보기 **/
router.get('/comm_view/:commName&:commId', commBoardController.getComm);
/** 게시판 글쓰기 페이지 **/
router.get('/comm_write/:commName', commBoardController.writePage);
/** 게시판 글쓰기 **/
router.post('/comm_write/:commName', commBoardController.write);
/** 게시판 글수정하기 페이지 **/
router.get('/comm_modify/:commName&:commId', commBoardController.modifyPage);
/** (ajax)게시판 글수정하기 **/
router.post('/comm_modify_ajax/:commName&:commId', commBoardController.modifyAjax);
/** 게시판 글수정하기 **/
router.post('/comm_modify/:commName&:commId', commBoardController.modify);
/** (ajax)게시판 글삭제하기 **/
// router.post('/comm_remove/:commName&:commId', commBoardController.remove);
router.post('/comm_remove', commBoardController.remove);
/** (ajax)게시판 댓글 목록보기 **/
router.post('/comm_comment_view', commBoardController.listComment);
/** (ajax)게시판 댓글 등록하기 **/
router.post('/comm_comment_submit', commBoardController.submitComment);
/** (ajax)게시판 댓글 삭제하기 **/
router.post('/comm_comment_del', commBoardController.delComment);
/** (ajax)게시판 댓글 수정하기 **/
router.post('/comm_comment_modify', commBoardController.modifyComment);

module.exports = router;
