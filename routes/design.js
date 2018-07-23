/* design.js
* 디자인 게시판
*/
'use strict';
var multer = require('multer'); // express에 multer모듈 적용 (for 파일업로드)
var upload = multer({ dest: 'pages/img/designUploads' });

const express = require('express');
const router = express.Router();
const designController = require('../models/design');

/*이미지 업로드 함수*/
function imageUpload(files) {
    fs.readFile(files.path, function (err, data) {
        var filePath = __dirname + '\\uploadFolder\\' + files.originalname;
        fs.writeFile(filePath, data, function (error) {
            if (error) {
                throw error;
            } else {
                fs.unlink(files.path, function (removeFileErr) {
                    if (removeFileErr) {
                        throw removeFileErr;
                    }
                });
            }
        });
    });
}

/** 디자인 리스트 보기 **/
router.get('/design', designController.list);
/** 디자인 글쓰기 **/
router.get('/designWritePage',  designController.writePage);
// router.post('/designWrite',upload.fields([{ name: 'pc_main' }, { name: 'mobile_main' }, { name : 'teblet_main' }]) , designController.write);
// router.post('/designWrite',upload.fields([{ name: 'pc_main' }, { name: 'mobile_main' }, { name : 'teblet_main' }]) , function(req, res){
router.post('/designWrite',upload.single('pc_main') , function(req, res){


    console.log("designWrite post req.boby ===>", req.body);
    console.log("designWrite post file ---> ",  req.files);
    res.redirect('/designWritePage');
 

});

/** 디자인 글수정하기 **/
// router.put('/modify', designController.modify);
/** 디자인 글삭제하기 **/
// router.delete('/remove', designController.remove);

module.exports = router;
