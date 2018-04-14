'use strict';

const mysql = require('mysql');
const dbProp = require('../.prop/props').db;
const dbinstance = {};
// var currDB;

const createDBPool = (param, callback) => {
    console.log('[conncreateDBPoolPool] param', param);
    dbinstance[param.db] = mysql.createPool({
        connectionLimit : dbProp[param.db].connectionLimit,
        host     : dbProp[param.db].host,
        user     : dbProp[param.db].user,
        password : dbProp[param.db].password,
        port     : dbProp[param.db].port,
        database : dbProp[param.db].database,
    });
    console.log(`[${param.db}] Connected to database pool.`);
    // currDB = param.db;
    return callback(dbinstance[param.db], null);
}
const createAndGetDBPool = (param, callback) => {
    createDBPool({db: param.db}, (pool, err)=>{
        console.log('error?', err);

        /*** Pool events ***/
        /* 1. acquire */
        /** The pool will emit an acquire event when a connection is acquired from the pool */
        pool.on('acquire', function (connection) {
            console.log('Connection %d acquired', connection.threadId);
        });

        /* 2. connection */
        /** The pool will emit a connection event when a new connection is made within the pool. */
        /** If you need to set session variables on the connection before it gets used,
         * you can listen to the connection event. */
        pool.on('connection', function (connection) {
            console.log('Connection triggered and auto_increment_increment=1');
            connection.query('SET SESSION auto_increment_increment=1');
            // auto_increment_increment 변수 확인 : show session variables like 'auto_increment_increment'
        });

        /* 3. enqueue */
        /** The pool will emit an enqueue event when a callback has been queued
         *  to wait for an available connection. */
        pool.on('enqueue', function () {
            console.log('Waiting for available connection slot');
        });

        /* 4. release */
        /** The pool will emit a release event when a connection is released back to the pool. */
        /** This is called after all release activity has been performed on the connection,
         *  so the connection will be listed as free at the time of the event. */
        pool.on('release', function (connection) {
            console.log('Connection %d released', connection.threadId);
        });

        if(err){
            callback({result: 0});
        }else{
            // module.exports.dbpool[param.db] = pool;
            callback({result: 1});
        }
    })
};

// const connMysql = (param, callback) => {
//     console.log('[connMysql] param', param);
//     dbinstance[param.db] = mysql.createConnection({
//         host     : dbProp[param.db].host,
//         user     : dbProp[param.db].user,
//         password : dbProp[param.db].password,
//         port     : dbProp[param.db].port,
//         database : dbProp[param.db].database,
//     });
//     dbinstance[param.db].connect((err, packet) => {
//         if (err) {
//             console.error('Database connection failed: ' + err.stack);
//             return callback(null, err.code);
//         }
//         console.log('[mysql]Connected to database.');
//         currDB = param.db;
//         return callback(dbinstance, null);
//     });
// }
// const disconnMysql = (param, callback) => {
//     console.log('[disconnMysql] param', param);
//     dbinstance[param.db].end(function(err) {
//         if (err) {
//             console.error('Database disconn failed: ' + err.stack);
//             return callback(err);
//         }
//         console.log('[mysql]disconnected to database.');
//         currDB = '';
//         return callback();
//     });
// }
//
// exports.connectDB = (param, callback) => {
//     console.log('[connectDB] param', param);
//     switch (param.db){
//         case 'mysql':
//             connMysql(param, callback);
//             break;
//         default:
//             connMysql(param, callback);
//     }
// }
// exports.disconnectDB = (param, callback) => {
//     console.log('[connectDB] param', param);
//     switch (param.db){
//         case 'mysql':
//             disconnMysql(param, callback);
//             break;
//         default:
//             disconnMysql(param, callback);
//     }
// }
exports.createDBPool = (param, callback) => {
    switch (param.db){
        case 'mysql':
            createAndGetDBPool(param, callback);
            break;
        default:
            createAndGetDBPool(param, callback);
    }
}

// exports.getCurrDB = (callback)=>{
//     callback(currDB);
// }
module.exports.instance = dbinstance;
