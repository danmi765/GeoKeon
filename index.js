'use strict';

const fs = require('fs');
const port = 8000;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static('pages'));

// Body-Parser 추가 : 터미널설치 - npm i body-parser --save
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Express 서버 시작.
app.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);
