# DB Connection Pool

### Npmjs link
	https://github.com/mysqljs/mysql

## Connection Pool 이벤트
처음 Connection Pool 생성하면 아래 이벤트를 걸어놓는 것이다. 마치 jQuery처럼.  

[./db/conn.js](https://github.com/geoseong/rdb-study-doAdventure/blob/debug/db/conn.js)
```
const mysql = require('mysql');
const dbProp = require('../.prop/props').db;

const dbinstance = {};
var currDB;

exports.connPool = (param, callback) => {
    console.log('[connPool] param', param);
    dbinstance[param.db] = mysql.createPool({
        connectionLimit : 1,
        host     : dbProp[param.db].host,
        user     : dbProp[param.db].user,
        password : dbProp[param.db].password,
        port     : dbProp[param.db].port,
        database : dbProp[param.db].database,
    });
    console.log('[mysql-pool]Connected to database pool.');
    currDB = param.db;
    return callback(dbinstance[param.db], null);
}
...
```


[./models/dbconnpool.js](https://github.com/geoseong/rdb-study-doAdventure/blob/debug/models/dbconnpool.js)
```
...
pool.on('connection', function (connection) {
    console.log('Connection triggered and auto_increment_increment=1');
    connection.query('SET SESSION auto_increment_increment=1');
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

...

/* pool 강제종료. */
pool.end((err) => {
    // all connections in the pool have ended
    console.log('Connection pool ended');
});
...
```
### Connection Pool 생성 직후 벌어지는 일
	- 겉으로는 없음
	- Client Connections에도 세션 생성 되어있지 않음. 정상임.

### Connection Pool 생성 후 리턴된 객체.query()를 하면 벌어지는 일
```
dbconn.connDB['mysql'].query(queries.select['user_manage_tbl'], function (error, results, fields) {
    if (error) {
        console.error('[connection.query]error: ' + error);
        return res.send({'error': error});
    }
    return res.send({'resp': results});
});
```
1. connection 이벤트 실행됨 : ex) Connection triggered and auto_increment_increment=1
2. acquire 이벤트 실행됨 : 새로운 세션 만듦. ex) Connection 15933 acquired.
3. release 이벤트 실행됨 : 만들어진 세션 반납. ex) Connection 15933 released.
4. 굳이 release() 함수를 안 써도 알아서 release가 된다.

### Connection Pool 생성 후 리턴된 객체.getConnection() 후 콜백함수에서 리턴된 객체.query()를 하면 벌어지는 일
```
dbconn.connDB['mysql'].getConnection((err, connection)=> {
    connection.query('SELECT * FROM user_manage_tbl', (error, results, fields) => {
        res.header('Content-type','application/json');
        res.send({'results': results });
    });
});
```
1. connection 이벤트 실행됨 : ex) Connection triggered and auto_increment_increment=1
2. acquire 이벤트 실행됨 : 새로운 세션 만듦. ex) Connection 15933 acquired.
3. enqueue 이벤트 실행됨 : ex) Waiting for available connection slot
4. 얻어낸 connection pool 객체 release안된다.
5. 결국 세션 누수가 발생된다. 데드락 세션 하나 생성되고 못쓰게 된다.
6. connection.release() 함수를 쓰지 않으면 5번 꼴 나는 거다.


## SQL
MySql접속 Session 확인 하기
```
show processlist;
```

Connection 수 확인하기
```
show status like 'Threads_connected';
```

동작중인 Connection 수 확인하기
```
show status like 'Threads_running';
```
SET SESSION auto_increment_increment=1

	- Session 함수에 대해서 변수 정의하는 구문임.
	- SHOW SESSION VARIABLES 로 정의된 변수값을 확인할 수 있다.
	- 확인해 보니 'auto_increment_increment' 라는 변수는 기본적으로 정의되어있는 변수였다.
