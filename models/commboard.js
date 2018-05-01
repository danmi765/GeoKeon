'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const { getFormmatedDt } = require('../utils/utils');

const list = (req, res) => {
    console.log('/commboard/list defaultDB:', defaultDB);
    const reqBody = req.body;

    dbconn.instance[defaultDB.db].query(queries.select.list_comm_board, function (error, results, fields) {
        if (error){
            console.log('[list]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/list results', results);
        let comms = results.map((commboard)=>{
            return { ...commboard, BOARD_INQUIRY_DATE: getFormmatedDt(commboard.BOARD_INQUIRY_DATE) }
        })
        return res.render('index', {  pages : 'comm.ejs', models:{comms : comms ,title : '커뮤니티 : 공지?', page_title : '공지?'} } );
    });
};

exports.getComm = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;
    console.log('/commboard/getComm reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.select.get_comm_board, [commId], function (error, results, fields) {
        if (error){
            console.log('[getComm]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/getComm results', results);
        let comms = results.map((commboard)=>{
            return { ...commboard, BOARD_INQUIRY_DATE: getFormmatedDt(commboard.BOARD_INQUIRY_DATE) }
        })

        // deep : 주소가 ../comm/1 일 때와 ../comm 일 때에 import해 오는 파일 경로가 달라지므로 deep으로 구분하여 import경로를 다르게 함
        return res.render('index', {pages : 'comm_view.ejs', models : { comms : comms[0], deep : true, title : '커뮤니티 : 공지?', page_title : '공지? - 글보기' }} );
    });
};

exports.modifyPage = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;
    console.log('/commboard/modifyPage reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.select.get_comm_board, [commId], function (error, results, fields) {
        if (error){
            console.log('[modifyPage]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/modifyPage results', results);
        let comms = results.map((commboard)=>{
            return { ...commboard, BOARD_INQUIRY_DATE: getFormmatedDt(commboard.BOARD_INQUIRY_DATE) }
        })
        // deep : 주소가 ../comm/1 일 때와 ../comm 일 때에 import해 오는 파일 경로가 달라지므로 deep으로 구분하여 import경로를 다르게 함
        return res.render('index', {pages : 'comm_write', models : { comms : comms[0], deep : true, title : '커뮤니티 : 공지?', page_title : '공지? - 글수정' }});
    });
};

exports.writePage = function(req, res){
    return res.render('index', { pages : 'comm_write.ejs',models :{ comms: null, deep : false , title : '커뮤니티 : 공지?', page_title : '공지? - 글쓰기' }});
};

exports.remove = function(req, res){
    const reqBody = req.body;
    const commId = req.params.commId;
    console.log('/commboard/remove reqBody: ', reqBody, ' / commId: ', commId);

    dbconn.instance[defaultDB.db].query(queries.delete.delete_comm_board, [commId], function (error, results, fields) {
        if (error){
            console.log('[remove]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/remove results', results);
        // deep : 주소가 ../comm/1 일 때와 ../comm 일 때에 import해 오는 파일 경로가 달라지므로 deep으로 구분하여 import경로를 다르게 함
        return list(req, res);
    });
};

/* EXPORT AREA */
exports.list = list;
