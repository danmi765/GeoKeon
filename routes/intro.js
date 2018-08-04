/* intro.js
* 소개 페이지
*/
'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const introController = require('../models/intro');

/**
 * @author geoseong
 * @description single 이미지 file upload를 위한 multer세팅 후 라우팅
 */
// const uploadSetting = multer({dest:"pages/img/upload/"});
// router.post('/imgupload', uploadSetting.single('upload'), introController.imgupload);

/**
 * @author geoseong
 * @description 소개페이지 메인
 */
router.get('/intro', introController.introMain);
/**
 * @author geoseong
 * @description 소개 내용 제출하기
 */
router.post('/submit_intro', introController.submitIntro);

module.exports = router;
