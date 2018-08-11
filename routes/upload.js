/* upload.js
* 파일 업로드
*/
'use strict';

const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../models/upload');

/**
 * @name imgupload
 * @author geoseong
 * @description single 이미지 file upload를 위한 multer세팅 후 라우팅
 */
const uploadSetting = multer({dest:"pages/img/upload/"});
router.post('/imgupload', uploadSetting.single('upload'), uploadController.imgupload);

// router.get('/designDelOrModi', uploadController.deleteDesign);
module.exports = router;
