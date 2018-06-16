'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const bcrypt = require('bcrypt');
// const salt = bcrypt.genSaltSync(10);
const { setSessionStorage } = require('../utils/sessionStorage');
const { getFormmatedDt } = require('../utils/utils');
const CryptoJS = require("crypto-js");
const randomstring = require("randomstring"); // 비밀번호 생성을 위한 랜덤문자열 
const nodemailer = require('nodemailer'); // 비밀번호 이메일 발송
const split = require('node-split').split;


// 로그인
exports.loginPage = function(req, res){

    // 기존 user_id 세션 있을 경우 삭제
    if( req.session.authId ){
        delete req.session[req.session.authId];
        delete req.session.authId;
    }  
    
    let salt = bcrypt.genSaltSync(10); // salt key 생성
    console.log("====> salt : ", salt);
    req.session.joins = salt; // 세션에 저장
    
    req.session.save(function(){ // 세션 저장 후 렌더
       //  res.redirect('/login');
        res.render('index', {pages : 'login.ejs', models : {title : '로그인', page_title : '로그인', salt: salt}});
       
    });
}


exports.login = function(req, res){

    console.log('login req.body:', req.body);
    console.log('session.joins ===> ', req.session.joins);

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
            if(!bcrypt.compareSync(user_db_data.user_pw, results[0].USER_PW)){
                return res.send({data : -1 });
              
            // 탈퇴한 회원
            }else if(results[0].STATUS == 'F'){
                return res.send({data : 2 });
                
            // 로그인 성공
            }else{
                // 로그인 당시 시간 캡쳐 
                const loginDt = {    
                    loginDt : new Date()
                }
                // 사용한 salt key(joins)값 삭제(추가함.- 거성)
                req.session.joins = '';

                // 세션 존재하면 기존세션 제거 후 발급 : 중복로그인 방지
                req.session.authId = user_db_data.user_id; // 사용자 아이디 세션에 저장

                // 로그인되는 순간에 저장되는 값이 변하지 않는 세션
                req.session[user_db_data.user_id] = loginDt;
                // 새로 로그인할 때마다 값이 새로 들어가는 세션 영역에 저장하기
                setSessionStorage(user_db_data.user_id, loginDt)

                // 마지막 접속일 저장
                dbconn.instance[defaultDB.db].query(queries.update.update_user_login_dt, [getFormmatedDt(loginDt.loginDt).datetime, user_db_data.user_id], function (error, results, fields) {
                  
                    if (error){
                        return res.send({'error': error});
                    }

                    req.session.save(function(){ // 세션 저장 후 렌더
                        return res.send({data : 0 });
                    });

                }); // LOGIN_DT_USER_QUERY END

                
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

        dbconn.instance[defaultDB.db].query(queries.insert.add_user, [user_db_data.user_id, hash, user_db_data.user_name, user_db_data.user_phone, user_db_data.user_email, new Date(), 'T'], function (error, results, fields) {
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
    res.render('index', {pages : 'findpw.ejs', models : {title : '비밀번호찾기', page_title : '비밀번호찾기'}});
};

exports.findPw = function(req, res){

    console.log("req.body ------> ", req.body.user_id);

    // query --> select.get_user_id
    dbconn.instance[defaultDB.db].query(queries.select.get_user_id, [req.body.user_id], function (error, results, fields) {

        if (error){
            console.log("에러났어요------------>", error);
            return res.send({'error': error});
        }

        // 해당 아이디가 존재하지 않음.
        if( results.length == 0){
            res.render('index', {pages : 'findpw.ejs', models : {title : '비밀번호찾기', page_title : '비밀번호찾기', msg : '아이디가 존재하지 않습니다.'}});
        }

        // 해당 아이디가 존재함.
        if(results.length >= 1){

            // 새로운 비밀번호 생성
            var new_password = 
                randomstring.generate({
                    length: 10,
                    charset: 'geokeon8991'
                });

            // 사용자  email로 전송
            var transporter = nodemailer.createTransport({              
                service: 'Gmail',
                auth: {
                    user: 'bizentrotspark@gmail.com',
                    pass: 'geokeon2018'
                }
            });

            var mailOptions = {  
                from: '관리자 <bizentrotspark@gmail.com>',
                to: results[0].USER_EMAIL,
                subject: '새로운 비밀번호를 발송하였습니다.',
                text: '새로운 비밀번호는 [ ' + new_password + ' ]입니다. 로그인 후 비밀번호를 변경해 주세요.'
            };

            transporter.sendMail(mailOptions, function(err, info){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Email sent! --> ", info.response);
                }
                transporter.close();
            });
                
            // 새로운 비밀번호 암호화
            bcrypt.hash(new_password, req.session.joins,  function(err, hash) {

                // 암호화된 새 비밀번호 update
                dbconn.instance[defaultDB.db].query(queries.update.update_user_pw, [hash, req.body.user_id], function (error, results, fields) {
                    if (error){
                        console.log("에러났어요------------>", error);
                        return res.send({'error': error});
                    }                    
                }); // 업데이트 끝

            });// 해싱 끝

            res.render('index', {pages : 'main.ejs', models : {title : '로그인', page_title : '로그인', find_pw : '1'}});

        }
    }); // dbconn End
};


// 마이페이지
exports.mypage = function(req, res){

    /** lev = 1 ---> 내작성글
        lev = 2 ---> 정보수정 **/
    console.log(req.query.lev);

    if( req.query.lev == 1 ){

        // 해당회원의 아이디를 불러와 작성한 게시글과 댓글 리스트를 select하여 ejs로 보낸다.
        // 관리자일 경우엔 관리자페이지를 따로 설정하기 떄문에 일반회원기준으로만 작성함.
        // select --> get_comm_board (BOARD_INQUIRY) 에서 가져옴.

        var user_id = req.session.authId;

        console.log("user_id -----> ", user_id);
        
        // 게시글 select
        dbconn.instance[defaultDB.db].query(queries.select.get_comm_board, [tables['INQUIRY'], 'BOARD_INQUIRY_WRITER' ,user_id,'BOARD_INQUIRY_DATE'], function (error, results, fields) {

            console.log("res =====> ", results);

            let my_post = results.map((mypage_comm)=>{
                return { ...mypage_comm, 'BOARD_INQUIRY_DATE': getFormmatedDt(mypage_comm['BOARD_INQUIRY_DATE']).date }
            });

            // 댓글 select
            dbconn.instance[defaultDB.db].query(queries.select.get_comment_list, [tables['COMMENT_INQUIRY'], 'COMMENT_INQUIRY_WRITER' ,user_id, 'COMMENT_INQUIRY_DATE'], function (error, results, fields) {
                
                console.log("res =====> ", results);

                let my_comment = results.map((mypage_comm)=>{
                    return { ...mypage_comm, 'COMMENT_INQUIRY_DATE': getFormmatedDt(mypage_comm['COMMENT_INQUIRY_DATE']).date }
                });

                res.render('index', {pages : 'mypage.ejs', models : {title : '마이페이지', page_title : '마이페이지', lev : '1', my_post : my_post, my_comment : my_comment}});

            });
            

        });




    }else if( req.query.lev == 2 ){

        // 해당회원의 정보를 select하여 ejs로 보낸다.

        res.render('index', {pages : 'mypage.ejs', models : {title : '마이페이지', page_title : '마이페이지', lev : '2'}});

    }
    
};


// 마이페이지 정보수정 화면이동
exports.myInfoPage = function(req, res){
 
    dbconn.instance[defaultDB.db].query(queries.select.get_user_pw_for_user_id, [req.session.authId], function (error, results, fields) {

        // 복호화
        var bytes = CryptoJS.AES.decrypt( req.body.user_pw , req.session.joins);
        var decryptedPW = bytes.toString(CryptoJS.enc.Utf8);

        // 비밀번호 불일치
        if( !bcrypt.compareSync(decryptedPW, results[0].GK_USERS_PW) ){
            return res.send({data : false, msg : '비밀번호가 일치하지 않습니다.'});

        // 비밀번호 일치
        }else{
            return res.send({data : true});
        }
    }); // db End
};

// 내정보 수정 페이지로 이동
exports.myModiPage = function(req, res){

    // 내정보가져오기
    // 가져온정보 암호화 후 보내기
    // 쿼리 get_user_id

    var user_id = req.session.authId;

    dbconn.instance[defaultDB.db].query(queries.select.get_user_id, [user_id], function (error, results, fields) {
        
        if (error) {
            console.error('[connection.query]error: ' + error);
            return res.send({'error': error});
        }

        console.log("res----> ", results);

        var user_data = {
            user_id : results[0].GK_USERS_ID ,
            user_name : results[0].GK_USERS_NAME,
            user_email_id :  results[0].GK_USERS_EMAIL.split('@')[0],
            user_email_mail :  results[0].GK_USERS_EMAIL.split('@')[1],
            user_phone1 :  results[0].GK_USERS_PHONE.substr(0,3),
            user_phone2 :  results[0].GK_USERS_PHONE.substr(3,4),
            user_phone3 :  results[0].GK_USERS_PHONE.substr(7,10),
            user_join_date : results[0].GK_USERS_JOIN_DATE,
            user_status : results[0].GK_USERS_STATUS
        }

        console.log("user_data ------>",  user_data);

        res.render('index', {pages : 'mypage_infomodi.ejs', models : {title : '내정보수정', page_title : '내정보수정', user_data : user_data}});

    });
};

exports.myModi = function(req, res){

    var user_id = req.session.authId;

    console.log("req.body ===> ", req.body);

    dbconn.instance[defaultDB.db].query(queries.update.update_user_info, [req.body.user_data.user_name, req.body.user_data.user_phone, req.body.user_data.user_email, user_id], function (error, results, fields) {

        if (error) {
            console.error('[connection.query]error: ' + error);
            return res.send({'error': error});
        }
        return res.send({data : true}); 
    });
};



// 비밀번호 변경 페이지 이동
exports.changePwPage = function(req, res){

    res.render('index', {pages : 'mypage_pwmodi.ejs', models : {title : '비밀번호변경', page_title : '비밀번호변경'}});

};

exports.changePw = function(req, res){

    console.log("user_id--->", req.session.authId);
    console.log("user_new_pw--->", req.body.user_data);

    // 복호화
    var bytes = CryptoJS.AES.decrypt( req.body.user_data , req.session.joins);
    var decryptedPW = bytes.toString(CryptoJS.enc.Utf8);
    var user_db_data = JSON.parse(decryptedPW);

    console.log("user_db_data---->",user_db_data);

    bcrypt.hash(user_db_data, req.session.joins,  function(err, hash) {

        console.log("hash----->", hash);

        dbconn.instance[defaultDB.db].query(queries.update.update_user_pw, [ hash, req.session.authId], function (error, results, fields) {
            if (error) {
                console.error('[connection.query]error: ' + error);
                return res.send({'error': error});
            }
            
            // 사용한 salt key(joins)값 삭제
            req.session.joins = "";

            console.log("results.affectedRows =--------=> ", results.affectedRows );

            // 결과 값 날리는거 다시 정리하자

            if( results.affectedRows == 1 ){
                return res.send({data : true}); 
            }else {
                return res.send({data : false}); 
            }

        }); // DB 끝
    }); // 해싱 끝

};


// 회원탈퇴
exports.withdrawal = function(req, res){

    var user_id = req.session.authId;

    console.log("req.body--->", req.body);
    console.log("user_id--->", user_id);

    dbconn.instance[defaultDB.db].query(queries.update.update_user_withdtawal, [ 'F', req.body.user_data, user_id], function (error, results, fields) {
        if (error) {
            console.error('[connection.query]error: ' + error);
            return res.send({'error': error});
        }

        return res.send({data : true}); 

    });

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
