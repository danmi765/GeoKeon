/* commboard.js
* 커뮤니티 게시판
*/
'use strict';

const express = require('express');
const router = express.Router();
const designController = require('../models/design');

/** 게시판 리스트 보기 **/
router.get('/', designController.list);
/** 게시판 글쓰기 **/
router.post('/write', designController.write);
/** 게시판 글수정하기 **/
// router.put('/modify', designController.modify);
/** 게시판 글삭제하기 **/
// router.delete('/remove', designController.remove);

module.exports = router;
