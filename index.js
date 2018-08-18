'use strict';

const port = 8000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbconn = require('./dbconn/conn');
const defaultDB = 'mysql';  // 기본 Database 종류 정의. 해당 변수는 다른 곳에 널리 쓰기 위해 최하단의 exports 문법에서 다시 사용됨.
const session = require('express-session');
const { getSessionStorage, setSessionStorage } = require('./utils/sessionStorage');
const queries = require('./dbconn/queries');
const commboard = require('./models/commboard');
// const fs = require('fs');
// const multer = require('multer');
// const uploadSetting = multer({dest:"pages/img/upload/"});

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 // 쿠키 유효기간 1시간
    }
}));

/**
 * @name app.use
 * @description 서버 전체 전역변수 설정하는 영역
 * @description req.session을 전역으로 사용할 수 있음
 */
app.use(function(req, res, next) {
    const r = `http://127.0.0.1:${port}/`;
    res.locals = req.session;   /* 로그인 할때 authId와 loggedDt속성이 추가로 들어간다 */
    res.locals = {
        ...res.locals,
        lastLoginInfo : getSessionStorage((req.session.authId)?req.session.authId:null),  /* 세션 스토리지 저장소(js)에 있는 회원의 최신 로그인시간을 불러온다 */
        urls : {
            css_path : r + "css/",
            js_path : r + "script/",
            lib_path : r + "lib/",
            sub_path : "sub/" ,
            r_sub_path : r + "sub/", 
            img_path :  r + "img/",
            upload_img_path : r + "img/upload/"
        }
    }
    next();
});

// 주소 입력을 통해 서버 내부 특정 폴더경로에 접근 가능하게 설정
app.use(express.static('pages'));

// Body-Parser 추가 : 터미널설치 - npm i body-parser --save
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Static Page 경로와 View engine 설정하기
app.set('views', __dirname + '/pages'); // 루트폴더 설정
app.set('view engine', 'ejs');  // set the view engine to ejs
// app.engine('html', require('ejs').renderFile); // HTML 형식으로 변환시키는 모듈

// [라우팅] GET index
app.get('/', function(req, res) {

        commboard.latest_list('1', function(results){

            console.log("results-->", results);
            res.render('sub/main', { pages : 'main.ejs', models : { title : '메인', latest: results }});

        });
        

});
// [라우팅] POST error: Ajax통신 시 에러떴을 때 내뱉는 에러 페이지
app.post('/error', function(req, res) {
    return res.render('error/error', {msg: req.body.msg, mode: 'ajax'});
});
// [라우팅] design_collention
app.get('/design_collection', function(req, res) {
    res.render('sub/design_collection');
});

/* ■■■■■■■■■■■■소개 페이지 라우팅■■■■■■■■■■■■ */
app.use('/', require('./routes/intro'));
/* ■■■■■■■■■■■■커뮤니티 게시판 라우팅■■■■■■■■■■■■ */
app.use('/', require('./routes/commboard'));
/* ■■■■■■■■■■■■디자인 메뉴 라우팅■■■■■■■■■■■■ */
app.use('/', require('./routes/design'));
/* ■■■■■■■■■■■■로그인/가입 라우팅■■■■■■■■■■■■ */
app.use('/', require('./routes/account'));
/* ■■■■■■■■■■■■파일 업로드■■■■■■■■■■■■ */
app.use('/', require('./routes/upload'));

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
