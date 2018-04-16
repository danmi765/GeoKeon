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


app.set('views', __dirname + '\\pages'); // 루트폴더 설정
app.set('view engine', 'ejs');  // set the view engine to ejs
// app.engine('html', require('ejs').renderFile); // HTML 형식으로 변환시키는 모듈


/* ■■■■■■■■■■■■페이지 설정 시작■■■■■■■■■■■■ */

// index
app.get('/', function(req, res) {
    res.render('index');
});

// intro
app.get('/intro', function(req, res) {
    res.render('intro');
});

// comm
app.get('/comm', function(req, res) {
    res.render('comm');
});

// design
app.get('/design', function(req, res) {
    res.render('design');
});

// comm_list
app.get('/comm_list', function(req, res) {
    res.render('comm_list');
});

/* ■■■■■■■■■■■■페이지 설정 끝■■■■■■■■■■■■ */

// Express 서버 시작.
app.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);




/* CKEditor */
var multer = require('multer');

var uploadSetting = multer({dest:"pages/img/upload"});

app.post('/upload&responseType=json', uploadSetting.single('upload'), function(req,res) {

  var tmpPath = req.file.path;
  var fileName = req.file.filename;
  var newPath = "pages/img/upload/" + req.file.originalname;

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
