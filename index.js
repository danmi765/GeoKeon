'use strict';

const fs = require('fs');
const port = 8000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();

app.use(express.static('pages'));

// Body-Parser 추가 : 터미널설치 - npm i body-parser --save
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Express 서버 시작.
app.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);



//ckEditor
var multer = require('multer');

var uploadSetting = multer({dest:"pages/img/upload"});

app.post('/upload&responseType=json', uploadSetting.single('upload'), function(req,res) {

  var tmpPath = req.file.path;
  var fileName = req.file.filename;
  var newPath = "pages/img/upload/" + req.file.originalname;

    console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ : "
                ,req.file.originalname);


  fs.rename(tmpPath, newPath, function (err) {
    if (err) {
      console.log(err);
    }
    var html;
    var url = `'pages/img/upload/${req.file.originalname}'`;

    html = "";
    html += "<script type='text/javascript'>";
    html += "window.parent.CKEDITOR.tools.callFunction(";
    html += `'${req.file.originalname}' , '${url}', '전송완료')`;
    html += "</script>";

    res.send(
        {
            "uploaded": 1,
            "fileName": fileName,
            "url": url
        }
    );

  });
});
