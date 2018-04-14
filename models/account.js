'use strict';
const dbconn = require('../db/conn');
const queries = require('../db/queries');
const tables = require('../db/tables');
const defaultDB = require('../index');

exports.addUser = (req, res) => {
    console.log('/account/addUser', req.body);
    var reqBody = req.body;
    dbconn.instance[defaultDB.db].query(queries.insert.addUser, [tables['user_manage_tbl'], reqBody], function (error, results, fields) {
        if (error){
            return res.send({'error': error});
        }
        console.log('/addUser results', results);
        return res.send({'resp': results});
    });
};

exports.login = function(req, res){

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
