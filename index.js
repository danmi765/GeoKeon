'use strict';

const fs = require('fs');
const port = 8000;
const express = require('express');
const multer = require('multer');
const app = express();
const bodyParser = require('body-parser');

const uploadSetting = multer({dest:"pages/img/upload/"});

const dbconn = require('./dbconn/conn');
const defaultDB = 'mysql';  // 기본 Database 종류 정의. 해당 변수는 다른 곳에 널리 쓰기 위해 최하단의 exports 문법에서 다시 사용됨.

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

// comm_view
app.get('/comm_view', function(req, res) {
    res.render('comm_view');
});

// comm_write
app.get('/comm_write', function(req, res) {
    res.render('comm_write');
});

/* ■■■■■■■■■■■■페이지 설정 끝■■■■■■■■■■■■ */

/* 이미지 업로드 */
app.post('/upload*', uploadSetting.single('upload'), function(req,res) {
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


/* ■■■■■■■■■■■■커뮤니티 게시판 라우팅■■■■■■■■■■■■ */
app.use('/comm', require('./routes/commboard'));
/* ■■■■■■■■■■■■디자인 메뉴 라우팅■■■■■■■■■■■■ */
app.use('/design', require('./routes/design'));

// Express 서버 시작.
app.listen(port, () => {
    // Database 종류 선택 (mysql) 및 해당 데이터베이스 커넥션 풀 생성 해 놓음
    // 이렇게 생성된 커넥션 풀 객체는 쿼리를 사용하는 js에서 계속 커넥션 객체를 받아 돌려 쓰고 반납하는 식으로 한다.
    dbconn.createDBPool({db: defaultDB}, (result)=>{
        if(result.result === 0){
            console.error('[Express] Error: create DB Connection Pool');
        }else{
            /* 기본 DB정보 다른 곳에 쓸 수 있게 export */
            console.log('[Express] GK2018 Server started at %d port', port);
        }
    });
});

module.exports.db = defaultDB;
