'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const fs = require('fs');
const url = require('url');
const modelObj = { page_title : '소개' };

/**
 * @author geoseong
 * @description 소개페이지 메인
 * @param {Object} req 
 * @param {Object} res 
 */
exports.introMain = function(req, res){
  // modelObj.query_success_status = req.query.s; // update, insert, delete 성공유무
  let sql = dbconn.instance[defaultDB.db].query(queries.select.get_intro, [], function (error, results, fields) {
    console.log('[introMain] sql', sql.sql);
    if (error){
        console.log('[introMain]error', error);
        return res.send({'error': error});
    }
    modelObj.data = results[0];
    res.render('sub/intro', {models : modelObj});
  });
}
/**
 * @author geoseong
 * @description 소개페이지 내용 제출
 * @param {Object} req 
 * @param {Object} res 
 */
exports.submitIntro = function(req, res){
  const reqBody = req.body;
  let success_status; // 쿼리 성공유무
  // const finish = (success_status) => {
  //   res.redirect(url.format({
  //     pathname:"/intro", // redirect url
  //     query: {
  //         "s": success_status // 디자인성공유무 url파라미터
  //         // 그 외 필요 파라미터 전송
  //         }
  //   }));
  // }

  if (!res.locals || (res.locals.authId && res.locals.authId.length === 0)) {
    return res.send({'error': '로그인 되어 있지 않은 상태에서의 잘못된 접근입니다.'});
    // success_status = "f"; // update, insert, delete 성공유무
    // return finish(success_status);
  }
  let sql = dbconn.instance[defaultDB.db].query(queries.insert.add_intro, [
    reqBody.contents,
    res.locals.authId
  ], function (error, results, fields) {
    console.log('[submitIntro] sql', sql.sql);
    if (error){
        console.log('[submitIntro]error', error);
        return res.send({'error': error});
    }
    // 실행된 쿼리의 행 수가 0일 경우 
    if(results.affectedRows == 0){
      success_status = "f";
    }
    res.send(results);
  });
}
