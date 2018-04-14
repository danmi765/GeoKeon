'use strict';

const fs = require('fs');
const port = 8000;
const express = require('express');
const multer = require('multer');
const app = express();
const bodyParser = require('body-parser');

const uploadSetting = multer({dest:"pages/img/upload/"});

app.use(express.static('pages'));

// Body-Parser 추가 : 터미널설치 - npm i body-parser --save
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Express 서버 시작.
app.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);

app.post('/upload&responseType=json', uploadSetting.single('upload'), function(req,res) {
  var tmpPath = req.file.path;
  var fileName = req.file.filename;
  var filePath = req.file.path;
  var originalName = req.file.originalname;
  var newPath = "pages/img/upload/" + req.file.originalname;

  console.log('upload file:', req.file);

  fs.rename(tmpPath, newPath, function (err) {
      if (err) {
        console.log(err);
      }
      var url = `'pages/img/upload/${req.file.originalname}'`;

      res.send({
          "uploaded": 1,
          "fileName": fileName,
          "url": url
      });
  });
});
