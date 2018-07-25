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

    var files = req.files; // 업로드 될 이미지의 내용들

    // DB저장하기 위한 파일명 ( 파일이 없을 땐 공백으로 입력함 )
    var pc_main_img = " ";
    var mobile_main_img = " ";
    var tablet_main_img = " ";
    var db_img;
    
    console.log("req.body --->", req.body );
    console.log("req.body design name --->", req.body.design_name ); // 포트폴리오명
    console.log("req.body business num --->", req.body.business_num ); // 업종구분번호
    console.log("files --->", files ); 

    // 해당이미지가 들어왔을 경우
    if(files.pc_main){
        pc_main_img = files.pc_main[0].originalname;
    }
    if(files.mobile_main){
        mobile_main_img = files.mobile_main[0].originalname;
    }
    if(files.tablet_main){
        tablet_main_img = files.tablet_main[0].originalname;
    }
    console.log("pc_main_img -- >", pc_main_img);
    console.log("mobile_main_img -- >", mobile_main_img);
    console.log("tablet_main_img -- >", tablet_main_img);

    // DB에 저장하기 위해 이미지명 ,를 구분자로 붙이기
    db_img = pc_main_img + "," + mobile_main_img + "," + tablet_main_img;
    console.log("db_img --- >", db_img);

    // add_portpolio
    dbconn.instance[defaultDB.db].query(queries.insert.add_portpolio, [db_img, req.body.design_name, req.body.business_num ] , function (error, results, fields) {
        if (error){
            console.log('[design img input]error', error);
            return res.send({'error': error});
        }

        // insert 후 design list로 redirect
        res.redirect('/design');

    });

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