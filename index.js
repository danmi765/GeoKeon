'use strict';

const fs = require('fs');
const port = 8000;
const express = require('express');
const multer = require('multer');
const app = express();
const bodyParser = require('body-parser');

const uploadSetting = multer({dest:"pages/img/upload/"});

const dbconn = require('./db/conn');

// 주소 입력을 통해 서버 내부 특정 폴더경로에 접근 가능하게 설정
app.use(express.static('pages'));

// Body-Parser 추가 : 터미널설치 - npm i body-parser --save
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.set('views', __dirname + '/pages'); // 루트폴더 설정
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

// design
app.get('/design', function(req, res) {
    res.render('design');
});

// comm
app.get('/comm', function(req, res) {
    res.render('comm');
});

// comm_view
app.get('/comm_view', function(req, res) {
    res.render('comm_view');
});

// comm_write
app.get('/comm_write', function(req, res) {
    res.render('comm_write');
});

/* ■■■■■■■■■■■■페이지 설정 끝■■■■■■■■■■■■ */


/* ■■■■■■■■■■■■커뮤니티 게시판 라우팅 시작■■■■■■■■■■■■ */

app.use('/account', require('./routes/account'));  // 2. 회원 관리

/* ■■■■■■■■■■■■커뮤니티 게시판 라우팅 끝■■■■■■■■■■■■ */

// Express 서버 시작.
app.listen(port, () => {
    dbconn.createDBPool({db: defaultDB}, (result)=>{
        if(result.result === 0){
            console.error('[Express] Error: create DB Connection Pool');
        }else{
            console.log('[Express] Study Game Web Server started at %d port', port);
        }
    });
});

console.log(`Server running at http://127.0.0.1:${port}/`);


app.post('/upload&responseType=json', uploadSetting.single('upload'), function(req,res) {
  var tmpPath = req.file.path;
  var fileName = req.file.filename;
  var filePath = req.file.path;
  var originalName = req.file.originalname;
  var newPath = "pages/img/upload/" + req.file.originalname;

  fs.rename(tmpPath, newPath, function (err) {
      if (err) {
        console.log(err);
      }
      var url = `'pages/img/upload/${req.file.originalname}'`;

      res.send({
          "uploaded": 1,
          "fileName": fileName,
          "url": url
      });
  });
});
