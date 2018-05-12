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
const session = require('express-session');

const { getSessionStorage } = require('./utils/sessionStorage');

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized: true
}));

// 세션을 전역으로 사용할 수 있도록 함
app.use(function(req, res, next) {
    res.locals = req.session;   /* 로그인 할때 authId와 loggedDt속성이 추가로 들어간다 */
    
    res.locals = {
        ...res.locals,
        lastLoginDt : getSessionStorage(),  /* 세션 스토리지 저장소(js)에 있는 최종 로그인시간을 불러온다 */
        
    }
    next();
});


// 주소 입력을 통해 서버 내부 특정 폴더경로에 접근 가능하게 설정
app.use(express.static('pages'));

// Body-Parser 추가 : 터미널설치 - npm i body-parser --save
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.set('views', __dirname + '/pages'); // 루트폴더 설정
app.set('view engine', 'ejs');  // set the view engine to ejs
// app.engine('html', require('ejs').renderFile); // HTML 형식으로 변환시키는 모듈


/* ■■■■■■■■■■■■페이지 라우팅 시작■■■■■■■■■■■■ */
// GET index
app.get('/', function(req, res) {

    res.render('index', {pages : 'main.ejs',  models : { user : req.session.authId, title : '메인'}});
});

// GET intro
app.get('/intro', function(req, res) {

    res.render('index',  {pages : 'intro.ejs' ,models : { title : '소개', page_title : '소개'}});
});

// design_collention
app.get('/design_collection', function(req, res) {
    res.render('design_collection');
});


/* ■■■■■■■■■■■■페이지 라우팅 끝■■■■■■■■■■■■ */


/* 이미지 업로드 */
app.post('/upload*', uploadSetting.single('upload'), function(req, res) {
    console.log('image upload[req.body]', req.body);
    console.log('image upload[req.originalUrl]', req.originalUrl);  // 요청주소를 얻어낼 수 있다.
    console.log('image upload[req.params]', req.params);
    console.log('image upload[req.file]', req.file);

    const tmpPath = req.file.path;
    const uploadPath = "pages/img/upload/";
    let findFileName = req.file.originalname;
    let idx = 1;
    
    while(true){
        const isFileExist = fs.existsSync(uploadPath+findFileName);
        console.log('-----fs.existsSync', isFileExist);
        if(isFileExist){
            /* 파일명이 중복될 때 */
            /* 파일명 + 1 로 네이밍 한다. 그리고 네이밍한 파일명1도 중복되었는 지 확인하고 중복이 되었다면 파일명2로 하는 로직을 반복.. */
            console.log('findFileName[before]:', findFileName);
            let dotIdx = findFileName.lastIndexOf('.');
            let fileIdx = findFileName.substring(0, dotIdx).match(/\d+/);
            let fileDuplicateIdx = (fileIdx != null)?Number(fileIdx[0])+1 : 1;   //중복되는 파일의 인덱스값을 숫자로 추출.
            let fileNameExceptNum = (fileIdx != null)?findFileName.indexOf(Number(fileIdx[0])) : dotIdx;

            /* 파일이름을 재정의하고 다시 loop돌려서 변경된 파일이름과 중복되는 파일이 있는지 재확인 */
            findFileName = findFileName.substring(0, fileNameExceptNum) + fileDuplicateIdx + findFileName.substring(dotIdx);
        }else{
            /* 파일명이 중복된 게 없을 때 */
            return renameFS(tmpPath, findFileName)
        }
    }
    function renameFS(tmpPath, fileName){
        /* CKEditor가 발급한 random한 파일명을 변경하는 작업 */
        fs.rename(tmpPath, uploadPath + fileName, function (err) {
            if (err) {
                console.log('-----renameFS error', err);
                return res.send({
                    "uploaded": 0,
                    "error": {
                        "message": "파일 전송 중 오류가 발생하였습니다."
                    }
                }); 
            }
            return res.send({
                "uploaded": 1,
                "fileName": fileName,
                "url": `../img/upload/${fileName}`
            });
        });
    }
});


/* ■■■■■■■■■■■■커뮤니티 게시판 라우팅■■■■■■■■■■■■ */
app.use('/', require('./routes/commboard'));
/* ■■■■■■■■■■■■디자인 메뉴 라우팅■■■■■■■■■■■■ */
app.use('/design', require('./routes/design'));
/* ■■■■■■■■■■■■로그인/가입 라우팅■■■■■■■■■■■■ */
app.use('/', require('./routes/account'));

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

exports.db = defaultDB;
