'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');

exports.list = (req, res) => {
    console.log('/design/list defaultDB:', defaultDB);
    const reqBody = req.body;

    dbconn.instance[defaultDB.db].query(queries.select.list_portfolio, function (error, results, fields) {
        if (error){
            console.log('[list]error', error);
            return res.send({'error': error});
        }
        console.log('/design/list results', results);
        return res.render('sub/design', {pages : 'design.ejs', models : {designs:results, title : '디자인', page_title : '디자인'} });
    });
};

exports.write = function(req, res){
    const reqBody = req.body;
    dbconn.instance[defaultDB.db].query(queries.insert.add_comm_board, [tables['BOARD_INQUIRY'], reqBody], function (error, results, fields) {
        if (error){
            return res.send({'error': error});
        }
        console.log('/commboard/list results', results);
        return res.send({'resp': results});
    });
};
