'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');

exports.list = (req, res) => {
    console.log('/commboard/list defaultDB:', defaultDB);
    const reqBody = req.body;

    dbconn.instance[defaultDB.db].query(queries.select.list_comm_board, function (error, results, fields) {
        if (error){
            console.log('[list]error', error);
            return res.send({'error': error});
        }
        console.log('/commboard/list results', results);
        return res.render('comm', { comms : results });
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

/* for test */
// exports.query = (req, res) => {
//     console.log('/account/query req.body:', req.body);
//     console.log('/account/query defaultDB:', defaultDB.db);
//     dbconn.instance[defaultDB.db].query(queries.select['user_manage_tbl'], function (error, results, fields) {
//         if (error) {
//             console.error('[connection.query]error: ' + error);
//             return res.send({'error': error});
//         }
//         // console.log('[connection.query]results', results);
//         return res.send({'resp': results});
//     });
// };
