'use strict';
const dbconn = require('../db/conn');

exports.addConn = (req, res) => {
    console.log('/addconn req', req.body);
    var account = {
        db: req.body.d,
        // usrid: req.body.i, usrpw: req.body.p
    };
    dbconn.connectDB(account, (instance, err)=>{
        if(err){
            return res.send({'error': err})
        }
        console.log('instance state/threadId',instance.mysql.state,'/',instance.mysql.threadId);
        return res.send({'resp':`환영합니다. 관리자 ${instance.mysql.config.user}님.`});
    });
};

exports.disConn = (req, res) => {
    console.log('/disconn req', req.body);
    var account = {
        db: req.body.d
    };
    dbconn.disconnectDB(account, (err)=>{
        if(err){
            return res.send({'error': err})
        }
        return res.send({'resp':`disconnected`});
    });
};
