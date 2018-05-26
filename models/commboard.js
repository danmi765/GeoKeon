'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const { getFormmatedDt } = require('../utils/utils');
const { getSessionStorage } = require('../utils/sessionStorage');

const list = (req, res) => {
    /* queryString
        @page : 페이지 번호 (http://주소?page=1 할때의 page=1부분이 query이며, {page:1} 형태로 파싱됨)
        @type : 검색분류 (t: title / c: content / w: writer)
        @query : 검색단어    
    */
    const reqBody = req.body;
    const reqQuery = req.query;
    const commName = req.params.commName.toUpperCase(); // 게시판 테이블명 대문자로 변환
    const colId = tables[commName] + '_ID';
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

    /* 게시판 분류에 따른 테이블 컬럼명 정의 */
    if(commName == 'NOTICE'){
        board_date = 'BOARD_NOTICE_DATE';
        search_column = {
            t: 'BOARD_NOTICE_TITLE',
            c: 'BOARD_NOTICE_CONTENT',
            w: 'BOARD_NOTICE_WRITER'
        }
    }else if(commName == 'INQUIRY'){
        board_date = 'BOARD_INQUIRY_DATE';
        search_column = {
            t: 'BOARD_INQUIRY_TITLE',
            c: 'BOARD_INQUIRY_CONTENT',
            w: 'BOARD_INQUIRY_WRITER'
        }
    }

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
            tables[commName], colId, tables[commName], 
            colId, limitNo.start, rowsPerPage
        ];
    }

    console.log("[board list]commName : " + commName);
    console.log("[board list]tables.commName : " ,tables[commName]);
    console.log("[board list]search_column : " ,search_column);
    console.log("[board list]colId : " ,colId);
    
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
                    [board_date]: getFormmatedDt(commboard[board_date]).date ,  /* [board_date] : 'BOARD_NOTICE_DATE' || 'BOARD_INQUIRY_DATE'  */
                    display_num: (limitNo.start+idx)+1   /* display_num : 프론트에 보여지는 rownum. Backend의 board_XX_id와는 별개. */
                }
            })
            console.log('[board list]actual sql', execQuery.sql);
            return res.render('index', {  pages : 'comm.ejs', models:{comms : comms ,title : '커뮤니티 : 공지?', page_title : '공지?', comm_name : req.params.commName} } );
        }); //end query
}; //end list()

exports.getComm = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;
    const commName = req.params.commName.toUpperCase();
    const colId = tables[commName] + '_ID';
    let cntUp, query, board_date;

    console.log("req.params", req.params)
    console.log('/commboard/getComm reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.select.get_comm_board, [tables[commName], colId, commId], function (error, results, fields) {
        if (error){
            console.log('[getComm]error', error);
            return res.send({'error': error});
        }

        console.log('/commboard/getComm results', results);

        if(commName == 'NOTICE'){

            // 게시물 조회수
            cntUp = results[0].BOARD_NOTICE_CNT +1;
            query = queries.update.update_comm_notice_board_cnt_p;
            board_date = 'BOARD_NOTICE_DATE';

        }else if(commName == 'INQUIRY'){

            // 게시물 조회수
            cntUp = results[0].BOARD_INQUIRY_CNT +1;
            query = queries.update.update_comm_inquiry_board_cnt_p;
            board_date = 'BOARD_INQUIRY_DATE';

        }

        // 조회수 증가
        dbconn.instance[defaultDB.db].query(query, [cntUp, commId], function(error, updateRes, fields){

            console.log('/commboard/getComm updateRes', updateRes);
            let comms = results.map((commboard)=>{
                return { ...commboard, [board_date]: getFormmatedDt(commboard[board_date]).date }
            })

            return res.render('index', {pages : 'comm_view.ejs', models : { comms : comms[0], title : '커뮤니티 : 공지?', page_title : '공지? - 글보기', comm_name : req.params.commName }} );

        }); // 조회수증가 dbconn E

    }); // select dbconn E

};

exports.modifyPage = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;

    const commName = req.params.commName.toUpperCase(); // 게시판 테이블명 대문자로 변환
    const colId = tables[commName] + '_ID';
    let board_date;

    if(commName == 'NOTICE'){

        board_date = 'BOARD_NOTICE_DATE';

    }else if(commName == 'INQUIRY'){

        board_date = 'BOARD_INQUIRY_DATE';

    }

    console.log('/commboard/modifyPage reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.select.get_comm_board, [tables[commName], colId , commId], function (error, results, fields) {
        if (error){
            console.log('[modifyPage]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/modifyPage results', results);
        let comms = results.map((commboard)=>{
            return { ...commboard, [board_date]: getFormmatedDt(commboard[board_date]).date }
        })

        return res.render('index', {pages : 'comm_write', models : { comms : comms[0], title : '커뮤니티 : 공지?', page_title : '공지? - 글수정', comm_name : req.params.commName }});
    });
};

exports.modify = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;

    const commName = req.params.commName.toUpperCase(); // 게시판 테이블명 대문자로 변환
    const colId = tables[commName] + '_ID';
    let query;

    if(commName == 'NOTICE'){
        query = queries.update.update_comm_notice_board;

    }else if(commName == 'INQUIRY'){
        query = queries.update.update_comm_inquiry_board;

    }

    console.log('/commboard/modify reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(query, [reqBody.posts_title, reqBody.editor1 , commId], function (error, results, fields) {
        if (error){
            console.log('[modify]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/modify results', results);

        return list(req, res);

    }); // dbconn E

};

exports.writePage = function(req, res){
    return res.render('index', { pages : 'comm_write.ejs',models :{ comms: null, title : '커뮤니티 : 공지?', page_title : '공지? - 글쓰기', comm_name : req.params.commName }});
};

exports.write = function(req, res){
    console.log('글쓰기', req.body);
    console.log('글쓰기 req.params', req.params);

    const reqBody = req.body;
    const commName = req.params.commName.toUpperCase();
    let insertValues, query;

    if(commName == 'NOTICE'){

        insertValues = [
            [reqBody.posts_title, reqBody.editor1, reqBody.user_id, new Date()]
        ];
        query = queries.insert.add_comm_notice_board;

    }else if(commName == 'INQUIRY'){

        insertValues = [
            [reqBody.posts_title, reqBody.editor1, reqBody.posts_pw, reqBody.user_id, new Date()]
        ];
        query = queries.insert.add_comm_inquiry_board;

    }

    dbconn.instance[defaultDB.db].query(query, [insertValues], function (error, results, fields) {
        if (error){
            console.log('[WritePage]error', error);
            return res.send({'error': error});
        }

        return list(req, res);
    });
};

exports.remove = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;

    const commName = req.params.commName.toUpperCase(); // 게시판 테이블명 대문자로 변환
    const colId = tables[commName] + '_ID';

    console.log('/commboard/remove reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.delete.delete_comm_board, [tables[commName],colId,commId], function (error, results, fields) {
        if (error){
            console.log('[remove]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/remove results', results);
        return list(req, res);
    });
};

/* EXPORT AREA */
exports.list = list;
