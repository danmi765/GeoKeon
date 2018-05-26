'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const bcrypt = require('bcrypt');
// const salt = bcrypt.genSaltSync(10);
const { setSessionStorage } = require('../utils/sessionStorage');
const CryptoJS = require("crypto-js");


// 로그인
exports.loginPage = function(req, res){
    
    let salt = bcrypt.genSaltSync(10); // salt key 생성
    console.log("====> salt : ", salt);
    req.session.joins = salt; // 세션에 저장
    
    req.session.save(function(){ // 세션 저장 후 렌더
       res.redirect('/login');
       
    });
}


exports.login = function(req, res){

    console.log('login req.body:', req.body);

    // 복호화
    var bytes = CryptoJS.AES.decrypt( req.body.user_data , req.session.joins);
    var decryptedPW = bytes.toString(CryptoJS.enc.Utf8);
    var user_db_data = JSON.parse(decryptedPW);

    dbconn.instance[defaultDB.db].query(queries.select.get_user_id, [user_db_data.user_id], function (error, results, fields) {
        if (error){
            return res.send({'error': error});
        }

        // 아이디가 존재하지 않음
        if(results.length == 0 ){
            return res.send({data : 1 });
           
        }else{
            // 비밀번호 불일치
            if(!bcrypt.compareSync(user_db_data.user_pw, results[0].GK_USERS_PW)){
                return res.send({data : -1 });
              
            // 로그인 성공
            }else{
                // 로그인 당시 시간 캡쳐 
                const loginDt = {    
                    loginDt : new Date()
                }
                // 세션 존재하면 기존세션 제거 후 발급 : 중복로그인 방지
                req.session.authId = user_db_data.user_id; // 사용자 아이디 세션에 저장

                // 로그인되는 순간에 저장되는 값이 변하지 않는 세션
                req.session[user_db_data.user_id] = loginDt;
                // 새로 로그인할 때마다 값이 새로 들어가는 세션 영역에 저장하기
                setSessionStorage(user_db_data.user_id, loginDt)
                
                req.session.save(function(){ // 세션 저장 후 렌더
                    return res.send({data : 0 });
                 });
            }
        }
    });
     
};

// 가입 페이지 
exports.joinPage = function(req, res){
    res.render('index', {pages : 'join.ejs', models : {title : '회원가입', page_title : '회원가입'}});
}

// 가입하기
exports.join = function(req, res){

    console.log('join req.body--------------->', req.body);
    console.log('join req.session--------------->', req.session);
   
    // 복호화
    var bytes = CryptoJS.AES.decrypt( req.body.user_data , req.session.joins);
    var decryptedPW = bytes.toString(CryptoJS.enc.Utf8);
    var user_db_data = JSON.parse(decryptedPW);
  
    // 세션에 저장되어있는 salt key(joins)를 이용해서 비밀번호 암호화/ DB저장
    bcrypt.hash(user_db_data.user_pw, req.session.joins,  function(err, hash) {
        console.log('--------hash------------------->', hash);

        dbconn.instance[defaultDB.db].query(queries.insert.add_user, [user_db_data.user_id, hash, user_db_data.user_name, user_db_data.user_email, user_db_data.user_phone, new Date(), 'T'], function (error, results, fields) {
            if (error){
                console.log("에러났어요------------>", error);
                return res.send({'error': error});
            }

            // 사용한 salt key(joins)값 삭제
            req.session.joins = "";

            // 회원가입 성공
            if(results.affectedRows == 1){
                return res.send({data : true});

            // 회원가입 실패
            }else{
                return res.send({data : false});
            }
        });// 쿼리 끝
 
     }); // 해싱 끝
};


// 아이디 중복체크
exports.checkid = function(req, res){

    console.log('checkid req.body:', req.body);

        dbconn.instance[defaultDB.db].query(queries.select.get_user_id, [req.body.user_id], function (error, results, fields) {
            if (error){
                console.log("에러났어요------------>", error);
                return res.send({'error': error});
            }

            console.log("results.GK_USERS_ID ---> ", results.length);

            return res.send({data : results.length });

        });// 쿼리 끝
};


// 아이디 찾기
exports.findIdPage = function(req, res){
    res.render('index', {pages : 'findid.ejs', models : {title : '아이디찾기', page_title : '아이디찾기'}});
};

exports.findId = function(req, res){

    console.log("req.body ------> ", req.body.user_email);

    dbconn.instance[defaultDB.db].query(queries.select.get_user_id_for_email, [req.body.user_email], function (error, results, fields) {
        if (error){
            console.log("에러났어요------------>", error);
            return res.send({'error': error});
        }

        console.log("results.length ---> ", results.length);
        
        // 해당 이메일에 아이디 존재하지 않음.
        if(results.length == 0){
            res.render('index', {pages : 'findid.ejs', models : {title : '아이디찾기', page_title : '아이디찾기', msg : '아이디가 존재하지 않습니다.'}});
        }

        // 해당 이메일에 아이디가 존재할 경우.
        if(results.length >= 1){
            console.log("results ---> ", results);
            res.render('index', {pages : 'findid.ejs', models : {title : '아이디찾기', page_title : '아이디찾기', find_id : '아이디가 존재합니다', find_id_res : results}});
            
        }

    });

};

// 비밀번호 찾기
exports.findPwPage = function(req, res){

};

exports.findPw = function(req, res){

};


/* for test */
exports.query = (req, res) => {
    console.log('/account/query req.body:', req.body);
    console.log('/account/query defaultDB:', defaultDB.db);
    dbconn.instance[defaultDB.db].query(queries.select['user_manage_tbl'], function (error, results, fields) {
        if (error) {
            console.error('[connection.query]error: ' + error);
            return res.send({'error': error});
        }
        // console.log('[connection.query]results', results);
        return res.send({'resp': results});
    });
};