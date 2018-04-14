'use strict';

const fs = require('fs');
const port = 8000;
const express = require('express');
const multer = require('multer');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const router = express.Router();

const uploadSetting = multer({dest:"pages/uploads/"});

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

  console.log('upload tmpPath:', tmpPath, '/fileName:', fileName);
  console.log('upload tmpPath:', req.file);
  console.log('req.query:', req.query);

  var newPath = "pages/uploads/" + originalName;
  fs.rename(tmpPath, newPath, function (err) {
    if (err) {
      console.log(err);
    }
    // var html;
    // html = "잘됐다";
    res.send({
        "uploaded": 1,
        "fileName": fileName,
        "url": filePath
    });
  });
});
