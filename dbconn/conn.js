'use strict';

const mysql = require('mysql');
const dbProp = require('../.prop/props').db;
const dbinstance = {};
// var currDB;

const createDBPool = (param, callback) => {
    console.log('[conncreateDBPoolPool] param', param);
    dbinstance[param.db] = mysql.createPool({
        connectionLimit : dbProp[param.db].connectionLimit, // 동시 접속자수 제한하기.
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

        /* 1. acquire : 커넥션 풀로부터 커넥션을 얻고 나서 */
        /** The pool will emit an acquire event when a connection is acquired from the pool */
        pool.on('acquire', function (connection) {
            console.log('Connection %d acquired', connection.threadId);
        });

        /* 2. connection : 새로운 DB연결 권한 획득하는 순간 = 1슬롯 획득 시 */
        /** The pool will emit a connection event when a new connection is made within the pool. */
        /** If you need to set session variables on the connection before it gets used,
         * you can listen to the connection event. */
        pool.on('connection', function (connection) {
            console.log('Connection triggered and auto_increment_increment=1');
            connection.query('SET SESSION auto_increment_increment=1');
            // auto_increment_increment 변수 확인 : show session variables like 'auto_increment_increment'
        });

        /* 3. enqueue : 연결 제한 수가 꽉 찼을 때, 빈 슬롯이 날 때까지 대기 */
        /** The pool will emit an enqueue event when a callback has been queued
         *  to wait for an available connection. */
        pool.on('enqueue', function () {
            console.log('Waiting for available connection slot');
        });

        /* 4. release : DB연결 후 쿼리작업이 마무리되었을 때 사용했던 슬롯 반납 */
        /** The pool will emit a release event when a connection is released back to the pool. */
        /** This is called after all release activity has been performed on the connection,
         *  so the connection will be listed as free at the time of the event. */
        pool.on('release', function (connection) {
            console.log('Connection %d released', connection.threadId);
        });

        if(err){
            // 에러 발생 시 내뱉는 callback
            callback({result: 0});
        }else{
            // 커넥션 풀 정상 생성 후 커넥션 풀에 이벤트 (acquire / connection / enqueue / release) 적용 완료.
            callback({result: 1});
        }
    })
};

exports.createDBPool = (param, callback) => {
    switch (param.db){
        case 'mysql':
            createAndGetDBPool(param, callback);
            break;
        default:
            createAndGetDBPool(param, callback);
    }
}

module.exports.instance = dbinstance;
