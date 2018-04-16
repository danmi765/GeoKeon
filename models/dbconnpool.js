'use strict';
const dbconn = require('../db/conn');

exports.dbpool = (req, res) => {
    dbconn.connPool({db: 'mysql'}, (pool, err)=>{
        // console.log('instance mysql', pool.config);   //13881
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

        res.send({'results': 'Pool Successfully Created!' });
    })
};

exports.dbpoolgetconnection = (req, res) => {
    dbconn.connDB['mysql'].getConnection((err, connection)=> {
        // console.log('dbpoolgetconnection', connection);
        connection.query('SELECT * FROM user_manage_tbl', (error, results, fields) => {
            connection.release();   // 커넥션 풀 잘 썼습니다. 반납.
            res.header('Content-type','application/json');
            res.send({'results': results });
        });
    });
};

exports.dbpoolforceend = (req, res) => {
    dbconn.connDB['mysql'].end((err) => {
        // all connections in the pool have ended
        console.log('Connection pool ended');
        res.send({'results': 'Connection pool ended' });
    });
};
