/* design.js
* 디자인 게시판
*/
'use strict';

const express = require('express');
const router = express.Router();
const designController = require('../models/design');

/** 디자인 리스트 보기 **/
router.get('/', designController.list);
/** 디자인 글쓰기 **/
router.post('/write', designController.write);
/** 디자인 글수정하기 **/
// router.put('/modify', designController.modify);
/** 디자인 글삭제하기 **/
// router.delete('/remove', designController.remove);

module.exports = router;
