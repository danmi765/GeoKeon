/* design.js
* 디자인 게시판
*/
'use strict';


const express = require('express');
const router = express.Router();
const designController = require('../models/design');

const multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'pages/img/designUploads/' ) // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
        var photoType = file.originalname.split(".")[1];
        var photoName = file.originalname.split(".")[0];
        cb(null,  photoName + "_" + Date.now() + "." + photoType ) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
  });
const upload = multer({ storage: storage });



/** 디자인 리스트 보기 **/
router.get('/design', designController.list);
/** 디자인 글쓰기 **/
router.get('/designWritePage',  designController.writePage);
// router.post('/designWrite',upload.array('photos',3) , designController.write);
router.post('/designWrite',upload.fields( [{ name: 'pc_main' },{ name: 'mobile_main'},{ name: 'tablet_main'}] ) , designController.write);
// -----> array는 작동하는데 fields는 Unexpected field 발생함


/** 디자인 글수정하기 **/
// router.put('/modify', designController.modify);
/** 디자인 글삭제하기 **/
// router.delete('/remove', designController.remove);

module.exports = router;
