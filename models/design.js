'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');

exports.list = (req, res) => {
    console.log('/design/list defaultDB:', defaultDB);
    const reqBody = req.body;

    dbconn.instance[defaultDB.db].query(queries.select.list_portpolio, function (error, results, fields) {
        if (error){
            console.log('[list]error', error);
            return res.send({'error': error});
        }
        console.log('/design/list results', results);
        return res.render('design', {designs:results});
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