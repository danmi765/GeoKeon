/*

<< update, insert, delete 실행row 0 사용 >>

메소드 실행 첫줄 삽입 

        var success_status; // 쿼리 성공유무

쿼리 실행 후 삽입

        // 실행된 쿼리의 행 수가 0일 경우 
        if(results.affectedRows == 0){
            success_status = "f";
        }

리다이렉트

        res.redirect(url.format({
            pathname:"/design", // redirect url
            query: {
                "s": success_status // 디자인성공유무 url파라미터
                // 그 외 필요 파라미터 전송
                }
        }));

리다이렉트 후

        models.query_success_status = req.query.s; // update, insert, delete 성공유무

*/

'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const url = require('url');
const util = require('../utils/utils');  

// render시 보낼 models
const models = {
    title : 'GeoKeon',
    page_title : 'GeoKeon'
};



exports.list = (req, res) => {

    // 탭메뉴 번호
    let url_tab = req.query.tab;
    if(!url_tab){ 
        url_tab = "1";
    }

    domainList((domain_results) => {

        // 업종 별 포트폴리오 받아오기
        dbconn.instance[defaultDB.db].query(queries.select.list_portpolio, [url_tab] , function (error, results, fields) {
            if (error){
                console.log('[list]error', error);
                return res.send({'error': error});
            }

            // 페이지로 보낼 값들 입력
            models.title = '디자인'; // 페이지 탭 타이틀
            models.page_title = '디자인'; // 페이지 상단 타이틀
            models.dmoain_list = domain_results; // 탭 메뉴 리스트
            
            models.designs = results; // 리스트 내용물
            models.bisuness_domain_num = url_tab; // 탭 메뉴 번호 
            models.query_success_status = req.query.s; // update, insert, delete 성공유무

            return res.render('sub/design', {models : models} );
        });

    });
};

exports.writePage = function(req, res){

    domainList((domain_results) => {

        // 페이지로 보낼 값들 입력
        models.title = '디자인-글쓰기'; // 페이지 탭 타이틀
        models.page_title = '디자인-글쓰기'; // 페이지 상단 타이틀
        models.dmoain_list = domain_results; // 탭 메뉴 리스트

        return res.render('sub/designWrite', { models : models });
    });
};

exports.write = function(req, res){
    var success_status; // 쿼리 성공유무
    var files = req.files; // 업로드 될 이미지의 내용들

    // DB저장하기 위한 파일명 ( 파일이 없을 땐 공백으로 입력함 )
    var pc_main_img = " ";
    var mobile_main_img = " ";
    var tablet_main_img = " ";
    var db_img;

    // 해당이미지가 들어왔을 경우
    if(files.pc_main){
        pc_main_img = files.pc_main[0].filename;
    }
    if(files.mobile_main){
        mobile_main_img = files.mobile_main[0].filename;
    }
    if(files.tablet_main){
        tablet_main_img = files.tablet_main[0].filename;
    }

    // DB에 저장하기 위해 이미지명 ,를 구분자로 붙이기
    db_img = pc_main_img + "," + mobile_main_img + "," + tablet_main_img;
    console.log("db_img --- >", db_img);

    dbconn.instance[defaultDB.db].query(queries.insert.add_portpolio, [db_img, req.body.design_name, req.body.business_num ] , function (error, results, fields) {
        if (error){
            console.log('[design img input]error', error);
            return res.send({'error': error});
        }
        
        // 실행된 쿼리의 행 수가 0일 경우 
        if(results.affectedRows == 0){
            success_status = "f";
        }

        // insert 후 design list로 redirect
        res.redirect(url.format({
            pathname:"/design",
            query: {
                "s": success_status, // 디자인성공유무 url파라미터로 보기
                "tab" : req.body.business_num
                }
        }));


    });

};

exports.deleteDesign = function(req, res){
    var success_status; // 쿼리 성공유무

    dbconn.instance[defaultDB.db].query(queries.delete.delete_design, [req.query.design_id ] , function (error, results, fields) {
        if (error){
            console.log('[design img delete]error', error);
            return res.send({'error': error});
        }

        // 실행된 쿼리의 행 수가 0일 경우 
        if(results.affectedRows == 0){
            success_status = "f";
        }
    
        // 디자인 삭제 후 리스트로 이동
         res.redirect(url.format({
            pathname:"/design",
            query: {
                "s": success_status // 디자인성공유무 url파라미터로 보기
                }
        })); 

    });
};


exports.modifyDesignPage = function(req, res){

    console.log("req.body.design_id ---> ", req.body.design_id);

    domainList((domain_results) => {

        // get_portpolio_for_portpolio_id
        dbconn.instance[defaultDB.db].query(queries.select.get_portpolio_for_portpolio_id, [req.body.design_id ] , function (error, results, fields) {
            if (error){
                console.log('[design img select]error', error);
                return res.send({'error': error});
            }

            // 페이지로 보낼 값들 입력
            models.title = '디자인-수정하기'; // 페이지 탭 타이틀
            models.page_title = '디자인-수정하기'; // 페이지 상단 타이틀
            models.dmoain_list = domain_results; // 탭 메뉴 리스트

            models.portpolio = results[0]; // 수정할 디자인 정보

            return res.render('sub/designModi', {models : models  });
        });

    });
};


exports.modifyDesign = function(req, res){
    var success_status; // 쿼리 성공유무
    var business_id = req.body.business_num; // 업종구분번호
    var design_name = req.body.design_name // 디자인명
    var portpolio_id = req.body.portpolio_id // 포트폴리오번호

    var origin_img_arr = [
        req.body.pc_origin_name,  // 기존 PC메인 이미지명
        req.body.mobile_origin_name, // 기존 mobile메인 이미지명
        req.body.tablet_origin_name // 기존 tablet메인 이미지명
    ];
    var files = req.files; // 업로드된 이미지

    // 업로드 이미지 변경 시 
    if(files.pc_main){
        console.log("pc_main exist");
        origin_img_arr[0] = files.pc_main[0].filename;
    }
    if(files.mobile_main){
        console.log("mobile_main exist");
        origin_img_arr[1] = files.mobile_main[0].filename;
    }
    if(files.tablet_main){
        console.log("tablet_main exist");
        origin_img_arr[2] = files.tablet_main[0].filename;
    }

    // db업데이트 이미지 조합
    var update_ime_name = origin_img_arr[0] + "," + origin_img_arr[1] + "," + origin_img_arr[2];

    dbconn.instance[defaultDB.db].query(queries.update.update_portpolio, [update_ime_name, design_name, business_id,portpolio_id ] , function (error, results, fields) {
        if (error){
            console.log('[design img select]error', error);
            return res.send({'error': error});
        }

        // 실행된 쿼리의 행 수가 0일 경우 
        if(results.affectedRows == 0){
            success_status = "f";
        }

        res.redirect(url.format({
            pathname:"/design",
            query: {
                "s": success_status,
                "tab" : business_id
                }
        }));

    });
   
};
  

// ■■■■■■■■■■■■■■■■■■■
//      공통쿼리
// ■■■■■■■■■■■■■■■■■■■


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