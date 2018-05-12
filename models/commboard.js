'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const { getFormmatedDt } = require('../utils/utils');

const list = (req, res) => {
    console.log('/commboard/list defaultDB:', defaultDB);
    const reqBody = req.body;
    const commName = req.params.commName.toUpperCase(); // 게시판 테이블명 대문자로 변환
    const colId = tables[commName] + '_ID';
    let board_date;

    if(commName == 'NOTICE'){

        board_date = 'BOARD_NOTICE_DATE';

    }else if(commName == 'INQUIRY'){

        board_date = 'BOARD_INQUIRY_DATE';

    }

    console.log("commName : " + commName);
    console.log("tables.commName : " ,tables[commName]);
    console.log("colId : " ,colId);

    // 쿼리 실행
    dbconn.instance[defaultDB.db].query(queries.select.list_comm_board, [tables[commName], colId] ,function (error, results, fields) {
        // 예외처리
        if (error){
            console.log('[list]error', error);
            return res.send({'error': error});
        }

        console.log('/commboard/list results', results);
        
        let comms = results.map((commboard)=>{
            return { ...commboard, [board_date]: getFormmatedDt(commboard[board_date]).date }
        })
        return res.render('index', {  pages : 'comm.ejs', models:{comms : comms ,title : '커뮤니티 : 공지?', page_title : '공지?', comm_name : req.params.commName} } );
    });
};

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
            [reqBody.posts_title, reqBody.editor1, '로그인한아이디', new Date()]
        ];
        query = queries.insert.add_comm_notice_board;

    }else if(commName == 'INQUIRY'){

        insertValues = [
            [reqBody.posts_title, reqBody.editor1, reqBody.posts_pw, '로그인한아이디', new Date()]
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
