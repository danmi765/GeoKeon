'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const { getFormmatedDt } = require('../utils/utils');
const { getSessionStorage } = require('../utils/sessionStorage');
const bcrypt = require('bcrypt');
const CryptoJS = require("crypto-js");

/**
 * @author geoseong
 * @description 게시판 목록 리스트 불러오기
 */
exports.loadcommlist = function(req, res){
    console.log('[loadcommlist] defaultDB', defaultDB);
    let sql = dbconn.instance[defaultDB.db].query(queries.select.get_board_domain_list, [], function (error, results, fields) {
        if (error){
            console.log('[loadcommlist]error', error);
            return res.send({'error': error});
        }
        
        res.send(results);
    });
}

/**
 * @author geoseong
 * @description 게시판 리스트 보기 & 검색하기
    URL : /comm/:BOARD_DOMAIN_ID
    BOARD_DOMAIN_ID : 기볻 1-공지사항 / 2-문의사항
 */
const list = (req, res) => {
    /* queryString
        @page : 페이지 번호 (http://주소?page=1 할때의 page=1부분이 query이며, {page:1} 형태로 파싱됨)
        @type : 검색분류 (t: title / c: content / w: writer)
        @query : 검색단어    
    */
    const reqBody = req.body;   /* POST method parameters */
    const reqQuery = req.query; /* GET url parameters */
    const commName = req.params.commName;   /* 게시판 분류(board_domain_id) */
    var c_page = req.query.page; // url로 넘어온 페이지번호
    var v_cnt = req.query.cnt; // url로 넘어온 보여질 게시물 수 
    let board_date; /* 게시판 작성일 변환을 위해 존재하는 변수 */
    let search_type, 
        search_column = {
            't' : 'TITLE',
            'w' : 'USER_ID', 
            'c' : 'CONTENT'
        },
        search_query = reqQuery.comm_search_text;  /* SQL 검색 관련 변수 */
    let query_params, query, query_cnt_params;  /* SQL Query & 파라미터 지정하는 변수 */
    let query_string;   /* 페이징 링크에 들어갈 쿼리스트링 */

    /* 페이징에 쓰일 변수 */
    let pageNo = (reqQuery.page!==undefined)?reqQuery.page:1;
    if(!c_page){
        c_page = '1';
    }
    if(!v_cnt){
        v_cnt = 10;
    }
    let limitNo = { /* 쿼리에서 쓰일 파라미터. LIMIT [start],[end] */
        start : (pageNo-1) * v_cnt, 
        end : pageNo * v_cnt
    }

    /* [res 전역변수 지정] */
    res.locals.v_cnt= v_cnt;    /* 게시판 한페이지당 노출될 행 갯수 */
    res.locals.query = (reqQuery.comm_search_text)?reqQuery.comm_search_text:'';  /* 검색단어 */
    res.locals.type = (reqQuery.comm_search_select)?reqQuery.comm_search_select:'';     /* 검색타입 */
    
    console.log('---------------------------------------------')
    console.log('[board list:reqQuery]', reqQuery);
    console.log('[board list:reqParam]', req.params);

    /* 검색 분류(제목/작성자/내용)에 따른 쿼리 및 파라미터 정의 */
    if(reqQuery.comm_search_select){  /* 검색분류가 지정되었을 때 */
        query = queries.select.search_comm_board;
        search_type = reqQuery.comm_search_select;
        query_params = [
            commName, search_column[search_type], '%'+search_query+'%', c_page
        ];
        query_cnt_params = [
            commName, search_column[search_type], '%'+search_query+'%'
        ];
        query_string = `comm_search_text=${search_query}&comm_search_select=${search_type}`;
    }else{  /* 검색분류가 지정 안 되었을 때 */
        query = queries.select.list_comm_board;
        query_params = [
            commName, c_page
        ];
        query_cnt_params = [
            commName, search_column['t'], '%%'
        ];
        query_string = ''
    }

    // 해당 게시판의 총 길이 계산
    const getTotalCntQuery = dbconn.instance[defaultDB.db].query(queries.select.get_comm_board_length, query_cnt_params, function (error, totalCnt, fields) {
        console.log('[getTotalCntQuery]actual sql', getTotalCntQuery.sql);
        // 예외처리
        if (error) {
            console.log('[list]error', error);
            return res.send({'error': error});
        }
        // 게시글 불러오기 실행
        const execQuery = dbconn.instance[defaultDB.db].query(query, query_params, function (error, results, fields) {
            console.log('[board list]actual sql', execQuery.sql);
            // 예외처리
            if (error) {
                console.log('[list]error', error);
                return res.send({'error': error});
            }
            let comms = results.map((commboard, idx) => {
                return { 
                    ...commboard, 
                    DATE : getFormmatedDt(commboard['DATE']).date
                }
            });
            
            console.log('[board list] totalCnt', totalCnt);
            
            // 페이징에 필요한 변수들 
            var next_page = (Number(c_page)+1);
            var prev_page = (Number(c_page)-1); 
            if(next_page > Math.ceil(totalCnt[0].CNT / v_cnt)){
                next_page = Math.ceil(totalCnt[0].CNT / v_cnt);
            }
            if(prev_page == 0){
                prev_page = "1";
            }
            /* param : comm_search_text=1234&comm_search_select=t */
            var paging_var = {
                totalCnt : totalCnt[0].CNT, // 총 게시글 수
                totalPages : Math.ceil(totalCnt[0].CNT / v_cnt), // 총 페이지 수
                nowPage : c_page, // 현재 페이지
                next_url : `/comm/${commName}?page=${next_page}&${query_string}`, // 다음페이지
                prev_url : `/comm/${commName}?page=${prev_page}&${query_string}`, // 이전페이지
                url : `/comm/${commName}?page=`  //이동 시 사용할 url
            }
            
            console.log('[board list]comms[0]', comms[0]);
            console.log('[board list]paging_var', paging_var);
            console.log('---------------------------------------------')
            
            return res.render('board/list/list', { 
                models: {
                    title : '',
                    comms : comms , 
                    comm_name : req.params.commName ,
                    paging_var: paging_var
                } 
            });
        }); //end execQuery
    }); //end getTotalCntQuery
}; //end list()


/**
 * @author geoseong
 * @description 게시판 글 보기
 */
exports.getComm = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;
    let cntUp, query, board_date, comm_name;

    console.log("/commboard/getComm req.params", req.params)
    console.log('/commboard/getComm reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.select.get_comm_board, [commId], function (error, results, fields) {
        if (error){
            console.log('[getComm]error', error);
            return res.send({'error': error});
        }

        console.log('/commboard/getComm results', results);

        // 게시물 조회수
        cntUp = results[0].HITS +1;
        comm_name = results[0].BOARD_DOMAIN_ID;

        // 조회수 증가
        dbconn.instance[defaultDB.db].query(queries.update.update_board_hits, [cntUp, commId], function(error, updateRes, fields){

            console.log('/commboard/getComm updateRes', updateRes);
            let comms = results.map((commboard)=>{
                return { ...commboard, DATE: getFormmatedDt(commboard['DATE']).datetime }
            })

            console.log('[getComm] comms[0]', comms[0]);

            let salt = bcrypt.genSaltSync(10); // salt key 생성
            req.session.joins = salt; // 세션에 저장
            req.session.save(function(){ // 세션 저장 후 렌더
                return res.render('board/list/view', { 
                    models : { 
                        title : '',
                        comms : comms[0], 
                        comm_name : comm_name, 
                        salt: salt 
                    }
                });
            });
        }); // 조회수증가 dbconn E
    }); // select dbconn E
};

/**
 * @author geoseong
 * @description 게시판 글수정하기 페이지
 */
exports.modifyPage = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;

    const commName = req.params.commName;
    let board_date;

    console.log('/commboard/modifyPage reqBody: ', reqBody, ' / commId: ', commId);

    var ddd = dbconn.instance[defaultDB.db].query(queries.select.get_comm_board, [commId], function (error, results, fields) {
        if (error){
            console.log('[modifyPage]error', error);
            return res.send({'error': error});
        }

        console.log('/commboard/modifyPage results', results);

        let comms = results.map((commboard)=>{
            return { ...commboard, DATE: getFormmatedDt(commboard['DATE']).datetime }
        })

        let salt = bcrypt.genSaltSync(10); // salt key 생성
        req.session.joins = salt; // 세션에 저장
        req.session.save(function(){ // 세션 저장 후 렌더
            return res.render('board/list/write', {
                pages : 'comm_write', 
                models : { 
                    title : '',
                    comms : comms[0], 
                    comm_name : req.params.commName, 
                    salt: salt 
                }
            });
        });

    });
};

/**
 * @author geoseong
 * @description (ajax)게시판 글수정하기
 */
exports.modifyAjax = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId.replace('amp;','');    //Ajax로 요청하면 params가 &까지 딸려서 온다.
    const commName = req.params.commName.replace('amp;','');    //Ajax로 요청하면 params가 &까지 딸려서 온다.

    console.log('[ajax:modifyAjax] req.session.joins:', req.session.joins);
    console.log('[ajax:modifyAjax] reqBody:', reqBody, ' / commId: ', commId, '/ commName:', commName);
    console.log('[ajax:modifyAjax] session joins:', req.session.joins);
    
    // 복호화
    var bytes = CryptoJS.AES.decrypt(reqBody.user_data.posts_pw, req.session.joins);
    var decryptedPW = bytes.toString(CryptoJS.enc.Utf8);
    var user_db_data = JSON.parse(decryptedPW);

    // DB connection 1
    dbconn.instance[defaultDB.db].query(
        queries.select.get_comm_board ,
        [ 
            commId 
        ], 
        function (error, results, fields) {
            if (error){
                console.log('[modify]error', error);
                return res.send({'error': error});
            }
            console.log('[ajax:modifyAjax] select results', results);
            if (results.length === 0){
                console.log('[ajax:modifyAjax] 아무런 결과가 없어');
                return res.send({'error': '존재하지 않는 게시물입니다. 다시 시도해 보세요.'});
            }

            // 비밀번호 불일치
            // bcrypt는 int를 인자로 넣으면 에러를 뱉으므로 숫자데이터도 .toString()으로 변형할 것
            if(!bcrypt.compareSync(user_db_data.toString(), results[0]['PASSWORD'])){
                return res.send({'error': '게시글의 비밀번호가 일치하지 않습니다.'});
            }
            
            // DB connection 2
            dbconn.instance[defaultDB.db].query(
                queries.update.update_board_content , 
                [
                    reqBody.user_data.posts_title, 
                    reqBody.user_data.editor1, 
                    commId
                ], 
                function (error, modifyResult, fields) {
                    if (error){
                        console.log('[modify]error', error);
                        return res.send({'error': error});
                    }
                    console.log('[ajax:modifyAjax] modifyResult', modifyResult);
                    
                    res.send({
                        board_type: results[0]['BOARD_DOMAIN_ID']
                    });
                }
            ); // dbconn E
        }
    ); // dbconn E
};

/**
 * @author geoseong
 * @description 게시판 글수정하기
 */
exports.modify = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;

    const commName = req.params.commName;

    console.log('/commboard/modify reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.update.update_board_content , [reqBody.posts_title, reqBody.editor1 , commId], function (error, results, fields) {
        if (error){
            console.log('[modify]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/modify results', results);

        return list(req, res);

    }); // dbconn E

};

/**
 * @author geoseong
 * @description 게시판 글쓰기 페이지
 */
exports.writePage = function(req, res){
    let salt = bcrypt.genSaltSync(10); // salt key 생성
    req.session.joins = salt; // 세션에 저장
    
    req.session.save(function(){ // 세션 저장 후 렌더
        return res.render('board/list/write', { 
            pages : 'comm_write.ejs',
            models :{ 
                title : '', 
                comms: null, 
                comm_name : req.params.commName, 
                salt: salt 
            }
        });
    });

};

/**
 * @author geoseong
 * @description 게시판 글쓰기
 */
exports.write = function(req, res){
    console.log('글쓰기', req.body);
    console.log('글쓰기 req.params', req.params);

    const reqBody = req.body;
    const commName = req.params.commName;

    // 복호화
    var bytes = CryptoJS.AES.decrypt(req.body.posts_pw , req.session.joins);
    var decryptedPW = bytes.toString(CryptoJS.enc.Utf8);
    var user_db_data = JSON.parse(decryptedPW);

    // 글쓰기 시 비밀번호 암호화하여 DB저장 필요!@!!!
    // 세션에 저장되어있는 salt key(joins)를 이용해서 비밀번호 암호화/ DB저장
    // bcrypt는 int를 인자로 넣으면 에러를 뱉으므로 숫자데이터도 .toString()으로 변형할 것
    bcrypt.hash(user_db_data.toString(), req.session.joins,  function(err, hash) {
        console.log('--------hash------------------->', hash);
        dbconn.instance[defaultDB.db].query(
            queries.insert.add_board_post, 
            [
                reqBody.posts_title, 
                reqBody.editor1, 
                hash, 
                new Date(), 
                '0', 
                req.session.authId, 
                commName 
            ], 
        function (error, results, fields) {
            if (error){
                console.log('[WritePage]error', error);
                return res.send({'error': error});
            }
            // 사용한 salt key(joins)값 삭제
            req.session.joins = '';
            res.redirect('/comm/'+req.params.commName);
        });
    });

};

/**
 * @author geoseong
 * @description (ajax)게시판 글삭제하기
 */
exports.remove = function(req, res){
    const reqBody = req.body;
    const commId = reqBody.user_data.commId;

    console.log('[ajax:remove] req.session.joins:', req.session.joins);
    console.log('/commboard/remove reqBody:', reqBody, ' / commId:', commId);

    // 복호화
    var bytes = CryptoJS.AES.decrypt(reqBody.user_data.posts_pw, req.session.joins);
    var decryptedPW = bytes.toString(CryptoJS.enc.Utf8);
    var user_db_pw = JSON.parse(decryptedPW);

    console.log('[ajax:remove] user_db_pw:', user_db_pw);

    let sql1 = dbconn.instance[defaultDB.db].query(queries.select.get_comm_board, 
        [
            commId
        ], 
        function (error, results, fields) {
            console.log('sql1:', sql1.sql);
            if (error){
                console.log('[remove]error', error);
                return res.send({'error': error});
            }
            // 비밀번호 불일치
            // bcrypt는 int를 인자로 넣으면 에러를 뱉으므로 숫자데이터도 .toString()으로 변형할 것
            if(!bcrypt.compareSync(user_db_pw.toString(), results[0]['PASSWORD'])){
                return res.send({'error': '게시글의 비밀번호가 일치하지 않습니다.'});
            }
            let sql2 = dbconn.instance[defaultDB.db].query(queries.delete.delete_comm_board, 
                [
                    commId, results[0]['PASSWORD']
                ], 
                function (error, removeResult, fields) {
                    console.log('sql2:', sql2.sql);
                    if (error){
                        console.log('[remove]error', error);
                        return res.send({'error': error});
                    }
                    console.log('/commboard/remove removeResult', removeResult);

                    if(removeResult.affectedRows === 0){
                        console.log('[remove]error', error);
                        return res.send({'error': '삭제하려는 게시글 번호가 옳지 않거나 게시글 비밀번호가 옳지 않습니다.'});
                    }
                    
                    // 사용한 salt key(joins)값 삭제
                    req.session.joins = '';

                    res.send({commType: results[0]['BOARD_DOMAIN_ID']});
                }
            ); //end sql2
        }
    ); //end sql1
};

/**
 * @author geoseong
 * @description (ajax)게시판 댓글 목록보기
 */
const listComment = (req, res) => {
    const reqBody = req.body;
    const commId = reqBody.commId;

    console.log('/commboard/listComment reqBody: ', reqBody);

    const dbquery = dbconn.instance[defaultDB.db].query(queries.select.get_comment_list, [commId], function (error, results, fields) {
        if (error){
            console.log('[listComment]error', error);
            return res.send({'error': error});
        }

        console.log('/commboard/listComment dbquery', dbquery.sql);
        console.log('/commboard/listComment results', results);

        let comms = results.map((commboard, idx)=>{
            return { 
                ...commboard, 
                DATE : getFormmatedDt(commboard['DATE']).datetime
            }
        })
        return res.send(comms);
    });
}

/**
 * @author geoseong
 * @description (ajax)게시판 댓글 등록하기
 */
exports.submitComment = function(req, res){
    const reqBody = req.body;
    const commName = reqBody.commName;

    console.log('/commboard/submitComment reqBody: ', reqBody);

    const dbquery = dbconn.instance[defaultDB.db].query(queries.insert.add_comment, [reqBody.content, new Date() ,  reqBody.writer,  reqBody.commId ], function (error, results, fields) {
            if (error){
                console.log('[submitComment]error', error);
                return res.send({'error': error});
            }
            console.log('/commboard/submitComment dbquery', dbquery.sql);
            console.log('/commboard/submitComment results', results);
            
            return listComment(req, res);
        });
}

/**
 * @author geoseong
 * @description (ajax)게시판 댓글 삭제하기
 */
exports.delComment = function(req, res){
    const reqBody = req.body;
    const commName = reqBody.commName; // 게시판 테이블명 대문자로 변환
    const commentId = reqBody.commentId;

    console.log('/commboard/delComment reqBody: ', reqBody);

    const dbquery = dbconn.instance[defaultDB.db].query(queries.delete.delete_comment, [commentId], function (error, results, fields) {
            if (error){
                console.log('[delComment]error', error);
                return res.send({'error': error});
            }

            console.log('/commboard/delComment', dbquery.sql);
            console.log('/commboard/delComment results', results);

            return listComment(req, res);
        });
}

/**
 * @author geoseong
 * @description 게시판 댓글 수정하기
 */
exports.modifyComment = function(req, res){
    const reqBody = req.body;
    const commName = reqBody.commName; // 게시판 테이블명 대문자로 변환
    const commentId = reqBody.commentId;
    const commentContent = reqBody.commentContent;

    console.log('/commboard/modifyComment reqBody: ', reqBody);

    const dbquery = dbconn.instance[defaultDB.db].query(queries.update.update_comment,[commentContent, commentId],  function (error, results, fields) {
            if (error){
                console.log('[modifyComment]error', error);
                return res.send({'error': error});
            }
            console.log('/commboard/modifyComment sql', dbquery.sql);
            console.log('/commboard/modifyComment results', results);
            return listComment(req, res);
        });
}

const latest_list = function(board_id, callback){
    dbconn.instance[defaultDB.db].query(queries.select.get_board_latest, [board_id, board_id], function (error, results, fields) {
        if (error){
            console.log('[loadcommlist]error', error);
            return res.send({'error': error});
        }
        
        let dateFormat = results.map((data, idx) => {
            return { 
                ...data, 
                DATE : getFormmatedDt(data['DATE']).date
            }
        });
        
        callback(dateFormat);
    });
}

/* EXPORT AREA */
exports.list = list;
exports.listComment = listComment;
exports.latest_list = latest_list;