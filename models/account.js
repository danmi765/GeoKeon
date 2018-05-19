'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const { setSessionStorage } = require('../utils/sessionStorage');


// 로그인
exports.login = function(req, res){

    console.log('login req.body:', req.body);

    var user_id = req.body.user_id; // 사용자 아이디
    var user_pw = req.body.user_pw; // 사용자 패스워드

    console.log('user_id:', user_id);

    dbconn.instance[defaultDB.db].query(queries.select.get_user_id, [user_id], function (error, results, fields) {
        if (error){
            return res.send({'error': error});
        }

        console.log('/getUser results', typeof results[0].GK_USERS_PW);

        // 아이디가 존재하지 않음
        if(results.length == 0 ){
            res.render('index', {pages : 'login.ejs', models : { title : '로그인', page_title : '로그인', msg : '아이디가 존재하지 않습니다.'}});

        }else{
            // 비밀번호 불일치
            if(!bcrypt.compareSync(user_pw, results[0].GK_USERS_PW)){
                res.render('index', {pages : 'login.ejs', models : { title : '로그인', page_title : '로그인', msg : '비밀번호가 일치하지 않습니다.'}});

            // 로그인 성공
            }else{
                /* 로그인 당시 시간 캡쳐 */
                const loginDt = {    
                    loginDt : new Date()
                }
                // 세션 존재하면 기존세션 제거 후 발급 : 중복로그인 방지
                req.session.authId = user_id; // 사용자 아이디 세션에 저장

                /* 로그인되는 순간에 저장되는 값이 변하지 않는 세션 */
                req.session[user_id] = loginDt;
                /* 새로 로그인할 때마다 값이 새로 들어가는 세션 영역에 저장하기 */
                setSessionStorage(user_id, loginDt)
                
                req.session.save(function(){ // 세션 저장 후 렌더
                    res.redirect('/');
                    // res.render('index', {pages : 'main.ejs', models : { title : '메인'}});
                 });
            }
        }
    });
};

// 가입
exports.join = function(req, res){

    console.log('join req.body:', req.body);

    bcrypt.hash(req.body.user_pw, salt,  function(err, hash) {
        console.log('--------hash------------------->', hash);

        dbconn.instance[defaultDB.db].query(queries.insert.add_user, [req.body.user_id, hash, req.body.user_name, req.body.user_email, req.body.user_phone, new Date(), 'T'], function (error, results, fields) {
            if (error){
                console.log("에러났어요------------>", error);
                return res.send({'error': error});
            }

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