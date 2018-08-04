'use strict';
const dbconn = require('../dbconn/conn');
const queries = require('../dbconn/queries');
const tables = require('../dbconn/tables');
const defaultDB = require('../index');
const fs = require('fs');
const modelObj = { page_title : '소개' };

/**
 * @author geoseong
 * @description 소개페이지 메인
 * @param {Object} req 
 * @param {Object} res 
 */
exports.introMain = function(req, res){
  res.render('sub/intro', {models : modelObj});
}
/**
 * @author geoseong
 * @description 소개페이지 내용 제출
 * @param {Object} req 
 * @param {Object} res 
 */
exports.submitIntro = function(req, res){
  res.render('sub/intro', {models : modelObj});
}
