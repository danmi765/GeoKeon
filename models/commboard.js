'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const { getFormmatedDt } = require('../utils/utils');
const { getSessionStorage } = require('../utils/sessionStorage');

/** 게시판 리스트 보기 & 검색하기 **/
const list = (req, res) => {
    /* queryString
        @page : 페이지 번호 (http://주소?page=1 할때의 page=1부분이 query이며, {page:1} 형태로 파싱됨)
        @type : 검색분류 (t: title / c: content / w: writer)
        @query : 검색단어    
    */

    /*
    
        URL : /comm/:BOARD_DOMAIN_ID
        BOARD_DOMAIN_ID : 기볻 1-공지사항 / 2-문의사항
    
    */
    const reqBody = req.body;
    const reqQuery = req.query;
    const commName = req.params.commName; 
    let board_date; /* 게시판 작성일 변환을 위해 존재하는 변수 */
    let search_type, search_column, search_query = reqQuery.comm_search_text;  /* SQL 검색 관련 변수 */
    let query_params, query;  /* SQL Query 지정하는 변수 */

    /* 페이징에 쓰일 변수 */
    let pageNo = (reqQuery.page!==undefined)?reqQuery.page:1;
    let rowsPerPage = 10;   /* 한페이지당 노출될 행 갯수 */
    let limitNo = { /* 쿼리에서 쓰일 파라미터. LIMIT [start],[end] */
        start : (pageNo-1) * rowsPerPage, 
        end : pageNo * rowsPerPage
    }
    /* [res 전역변수 지정] */
    res.locals.rowsPerPage= rowsPerPage;    /* 게시판 한페이지당 노출될 행 갯수 */
    res.locals.query = (reqQuery.comm_search_text)?reqQuery.comm_search_text:'';  /* 검색단어 */
    res.locals.type = (reqQuery.comm_search_select)?reqQuery.comm_search_select:'';     /* 검색타입 */
    
    console.log('[reqQuery]', reqQuery);
    console.log('[reqParam]', req.params);


    /* 검색 분류(제목/작성자/내용)에 따른 쿼리 및 파라미터 정의 */
    if(reqQuery.comm_search_select){  /* 검색분류가 지정되었을 때 */
        query = queries.select.search_comm_board;
        search_type = reqQuery.comm_search_select;
        query_params = [
            tables[commName], colId, tables[commName], search_column[search_type], 
            '%'+search_query+'%', search_column[search_type], '%'+search_query+'%', 
            colId, limitNo.start, rowsPerPage
        ];
    }else{  /* 검색분류가 지정 안 되었을 때 */
        query = queries.select.list_comm_board;
        query_params = [
            commName
        ];
    }

    console.log("[board list]commName : " + commName);
    
    // 쿼리 실행
    const execQuery = dbconn.instance[defaultDB.db].query(
        query, 
        query_params, 
        function (error, results, fields) {
            // 예외처리
            if (error){
                console.log('[list]error', error);
                return res.send({'error': error});
            }
            let comms = results.map((commboard, idx)=>{
                return { 
                    ...commboard, 
                    DATE : getFormmatedDt(commboard['DATE']).date , 
                    display_num: (limitNo.start+idx)+1   /* display_num : 프론트에 보여지는 rownum. Backend의 board_XX_id와는 별개. */
                }
            })
            console.log('[board list]actual sql', execQuery.sql);
            return res.render('index', { pages : 'comm.ejs', models:{comms : comms ,title : '커뮤니티 : 공지?', page_title : '공지?', comm_name : req.params.commName } } );
        }); //end query
}; //end list()

/** 게시판 글 보기 **/
exports.getComm = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;
    const commName = req.params.commName;
    let cntUp, query, board_date;

    console.log("req.params", req.params)
    console.log('/commboard/getComm reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.select.get_comm_board, [commId], function (error, results, fields) {
        if (error){
            console.log('[getComm]error', error);
            return res.send({'error': error});
        }

        console.log('/commboard/getComm results', results);


        // 게시물 조회수
        cntUp = results[0].HITS +1;

        // 조회수 증가
        dbconn.instance[defaultDB.db].query(queries.update.update_board_hits, [cntUp, commId], function(error, updateRes, fields){

            console.log('/commboard/getComm updateRes', updateRes);
            let comms = results.map((commboard)=>{
                return { ...commboard, DATE: getFormmatedDt(commboard['DATE']).datetime }
            })

            return res.render('index', {pages : 'comm_view.ejs', models : { comms : comms[0], title : '커뮤니티 : 공지?', page_title : '공지? - 글보기', comm_name : req.params.commName }} );

        }); // 조회수증가 dbconn E

    }); // select dbconn E

};

/** 게시판 글수정하기 페이지 **/
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

        console.log('ddd-->', ddd.sql);
        console.log('/commboard/modifyPage results', results);
        let comms = results.map((commboard)=>{
            return { ...commboard, DATE: getFormmatedDt(commboard['DATE']).datetime }
        })

        return res.render('index', {pages : 'comm_write', models : { comms : comms[0], title : '커뮤니티 : 공지?', page_title : '공지? - 글수정', comm_name : req.params.commName }});
    });
};

/** 게시판 글수정하기 **/
exports.modify = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;

    const commName = req.params.commName;

    console.log('/commboard/modify reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.update.update_baord_content , [reqBody.posts_title, reqBody.editor1 , commId], function (error, results, fields) {
        if (error){
            console.log('[modify]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/modify results', results);

        return list(req, res);

    }); // dbconn E

};

/** 게시판 글쓰기 페이지 **/
exports.writePage = function(req, res){
    return res.render('index', { pages : 'comm_write.ejs',models :{ comms: null, title : '커뮤니티 : 공지?', page_title : '공지? - 글쓰기', comm_name : req.params.commName }});
};

/** 게시판 글쓰기 **/
exports.write = function(req, res){
    console.log('글쓰기', req.body);
    console.log('글쓰기 req.params', req.params);

    const reqBody = req.body;
    const commName = req.params.commName;


    // 글쓰기 시 비밀번호 암호화하여 DB저장 필요!@!!!

    dbconn.instance[defaultDB.db].query(queries.insert.add_board_post, [reqBody.posts_title, reqBody.editor1, reqBody.posts_pw, new Date(), '0', req.session.authId ,commName ], function (error, results, fields) {
        if (error){
            console.log('[WritePage]error', error);
            return res.send({'error': error});
        }

        return list(req, res);
    });
};

/** 게시판 글삭제하기 **/
exports.remove = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;

    const commName = req.params.commName;

    console.log('/commboard/remove reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.delete.delete_comm_board, [commId], function (error, results, fields) {
        if (error){
            console.log('[remove]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/remove results', results);
        return list(req, res);
    });
};

/** 게시판 댓글 목록보기 **/
const listComment = (req, res) => {
    const reqBody = req.body;
    const commName = reqBody.commName; // 게시판 테이블명 대문자로 변환
    const commId = reqBody.commId;

    console.log('/commboard/listComment reqBody: ', reqBody);

    const dbquery = dbconn.instance[defaultDB.db].query(queries.select.get_comment_list, [ commId], function (error, results, fields) {
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
/** 게시판 댓글 등록하기 **/
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
/** 게시판 댓글 삭제하기 **/
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
/** 게시판 댓글 수정하기 **/
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

/* EXPORT AREA */
exports.list = list;
exports.listComment = listComment;