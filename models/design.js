'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');



exports.list = (req, res) => {

    let url_tab = req.query.tab;
    if(!url_tab){ 
        url_tab = "1";
    }
    console.log("url_tab ----> ", url_tab);

    domainList((domain_results) => {
        console.log('bisiness domain list results', domain_results);

        // 업종 별 포트폴리오 받아오기
        dbconn.instance[defaultDB.db].query(queries.select.list_portpolio, [url_tab] , function (error, results, fields) {
            if (error){
                console.log('[list]error', error);
                return res.send({'error': error});
            }

            console.log("designs results ", results);
            
            return res.render('sub/design', {pages : 'design.ejs', models : {title : '디자인', page_title : '디자인', designs : results, dmoain_list : domain_results, bisuness_domain_num : url_tab } });
        });

    });
};

exports.writePage = function(req, res){

    domainList((domain_results) => {
        return res.render('sub/designWrite', {pages : 'design.ejs', models : {title : '디자인-글쓰기', page_title : '디자인-글쓰기', dmoain_list : domain_results} });
    });
};

exports.write = function(req, res){



    
    var files = req.files;

    console.log("req.body --->", req.body );
    console.log("files --->", files );


    for(var i = 0; i < files.length; i++){
        console.log("[" + i + "]filename : " , files[i].originalname);
        console.log("[" + i + "]destination : " , files[i].destination);
        console.log("[" + i + "]fieldname : " , files[i].fieldname);
    }


    res.redirect('/designWritePage');

       
};







// 업종리스트 받아오기
const domainList = function(callback){
    dbconn.instance[defaultDB.db].query(queries.select.list_business_domain, function (error, domain_results, fields) {
        if (error){
            console.log('[list]error', error);
            return res.send({'error': error});
        }

        callback(domain_results);
    });
};

exports.domainList = domainList;