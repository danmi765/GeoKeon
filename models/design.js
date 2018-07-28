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
            console.log("designs results length ", results.length);
            
            return res.render('sub/design', {pages : 'design.ejs', models : {title : '디자인', page_title : '디자인', designs_length : results.length, designs : results, dmoain_list : domain_results, bisuness_domain_num : url_tab } });
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
        pc_main_img = files.pc_main[0].filename;
    }
    if(files.mobile_main){
        mobile_main_img = files.mobile_main[0].filename;
    }
    if(files.tablet_main){
        tablet_main_img = files.tablet_main[0].filename;
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

exports.deleteDesign = function(req, res){

    console.log("req.body.design_id ----> ", req.query);

    //delete_design
    dbconn.instance[defaultDB.db].query(queries.delete.delete_design, [req.query.design_id ] , function (error, results, fields) {
        if (error){
            console.log('[design img delete]error', error);
            return res.send({'error': error});
        }
        
        // 디자인 삭제 후 리스트로 이동
        res.redirect('/design');

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

            console.log("get_portpolio_for_portpolio_id results ---> ", results[0]);

            return res.render('sub/designModi', {pages : 'design.ejs', models : {title : '디자인-수정하기', page_title : '디자인-수정하기', dmoain_list : domain_results, portpolio : results[0] }  });
        });

    });
};


exports.modifyDesign = function(req, res){

    console.log("design-modify req.body --->" ,req.body);
    console.log("design-modify req.files --->" ,req.files);

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

    // update_portpolio
    dbconn.instance[defaultDB.db].query(queries.update.update_portpolio, [update_ime_name, design_name, business_id,portpolio_id ] , function (error, results, fields) {
        if (error){
            console.log('[design img select]error', error);
            return res.send({'error': error});
        }

        // 업데이트결과확인
        console.log("results.affectedRows ---> ", results.affectedRows);

        // 업데이트 오류 시 view표시하기
        // design페이지로 redirect하며 params로 에러유무 보내기?



        res.redirect('/design');

        // 리다이렉트 시 파라미터 보내기 
        // res.redirect(url.format({
        //     pathname:"/",
        //     query: {
        //         "a": 1,
        //         "b": 2,
        //         "valid":"your string here"
        //         }
        // }));

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