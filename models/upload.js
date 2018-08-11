'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const fs = require('fs');

/**
 * @author geoseong
 * @description 싱글 이미지파일 업로드
 * @param {Object} req 
 * @param {Object} res 
 */
exports.imgupload = function(req, res){
  const tmpPath = req.file.path;
  const uploadPath = "pages/img/upload/";
  let findFileName = req.file.originalname;
  let idx = 1;
  
  while(true){
      const isFileExist = fs.existsSync(uploadPath+findFileName);
      if(isFileExist){
          /* 파일명이 중복될 때 */
          /* 파일명 + 1 로 네이밍 한다. 그리고 네이밍한 파일명1도 중복되었는 지 확인하고 중복이 되었다면 파일명2로 하는 로직을 반복.. */
          let dotIdx = findFileName.lastIndexOf('.');
          let fileIdx = findFileName.substring(0, dotIdx).match(/\d+/);
          let fileDuplicateIdx = (fileIdx != null)?Number(fileIdx[0])+1 : 1;   //중복되는 파일의 인덱스값을 숫자로 추출.
          let fileNameExceptNum = (fileIdx != null)?findFileName.indexOf(Number(fileIdx[0])) : dotIdx;

          /* 파일이름을 재정의하고 다시 loop돌려서 변경된 파일이름과 중복되는 파일이 있는지 재확인 */
          findFileName = findFileName.substring(0, fileNameExceptNum) + fileDuplicateIdx + findFileName.substring(dotIdx);
      }else{
          /* 파일명이 중복된 게 없을 때 */
          return renameFS(tmpPath, findFileName)
      }
  }
  /**
   * @author geoseong
   * @description 임시로 저장된 파일명 및 경로 변경
   * @param {*} tmpPath 
   * @param {*} fileName 
   */
  function renameFS(tmpPath, fileName){
      /* CKEditor가 발급한 random한 파일명을 변경하는 작업 */
      fs.rename(tmpPath, uploadPath + fileName, function (err) {
          if (err) {
              console.log('-----renameFS error', err);
              return res.send({
                  "uploaded": 0,
                  "error": {
                      "message": "파일 전송 중 오류가 발생하였습니다."
                  }
              }); 
          }
          return res.send({
              "uploaded": 1,
              "fileName": fileName,
              "url": `../img/upload/${fileName}`
          });
      });
  }
}