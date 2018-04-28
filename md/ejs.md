# 동적으로 html홈페이지 구현하기

## 파일구조
```
- views
----- partials
---------- footer.ejs
---------- head.ejs
---------- header.ejs
----- pages
---------- index.ejs
---------- about.ejs
- package.json
- server.js
```

------------------------------------------------------------
## npm install
    $ npm install --save ejs express

------------------------------------------------------------

## 서버코딩
 ** server.js **
```
// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

app.listen(8080);
console.log('8080 is the magic port');
```
------------------------------------------------------------
** views/partials/head.ejs **
```
<meta charset="UTF-8">
<title>Super Awesome</title>

<!-- CSS (load bootstrap from a CDN) -->
<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
<style>
    body    { padding-top:50px; }
</style>
```

------------------------------------------------------------
** views/partials/header.ejs **
```
<nav class="navbar navbar-default" role="navigation">
<div class="container-fluid">

    <div class="navbar-header">
        <a class="navbar-brand" href="#">
            <span class="glyphicon glyphicon glyphicon-tree-deciduous"></span>
            EJS Is Fun
        </a>

        <ul class="nav navbar-nav">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
        </ul>
    </div>

</div>
</nav>
```
------------------------------------------------------------

** views/partials/footer.ejs **
```
<p class="text-center text-muted">© Copyright 2014 The Awesome People</p>
```
------------------------------------------------------------
------------------------------------------------------------

** views/pages/index.ejs **
```
<!DOCTYPE html>
<html lang="en">
<head>
    <% include ../partials/head %>
</head>
<body class="container">

<header>
    <% include ../partials/header %>
</header>

<main>
    <div class="jumbotron">
        <h1>This is great</h1>
        <p>Welcome to templating using EJS</p>
    </div>
</main>

<footer>
    <% include ../partials/footer %>
</footer>

</body>
</html>
```
------------------------------------------------------------

** views/pages/about.ejs **
```
<!DOCTYPE html>
<html lang="en">
<head>
    <% include ../partials/head %>
</head>
<body class="container">

<header>
    <% include ../partials/header %>
</header>

<main>
<div class="row">
    <div class="col-sm-8">
        <div class="jumbotron">
            <h1>This is great</h1>
            <p>Welcome to templating using EJS</p>
        </div>
    </div>

    <div class="col-sm-4">
        <div class="well">
            <h3>Look I'm A Sidebar!</h3>
        </div>
    </div>

</div>
</main>

<footer>
    <% include ../partials/footer %>
</footer>

</body>
</html>
```
------------------------------------------------------------
## View에 데이터 전달하기
** server.js **
```
// index page
app.get('/', function(req, res) {
    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";

    res.render('pages/index', {
        drinks: drinks,
        tagline: tagline
    });
});
```
** views/pages/index.ejs **
```
...
<h2>Variable</h2>
<p><%= tagline %></p>   <!-- // server.js의 res.render()에서 정의되었던 tagline이 표시됨 -->
...

...
<h2>Loop</h2>

<ul>
    <!-- // server.js의 res.render()에서 정의되었던 drinks 배열이 forEach반복문으로 돌면서 배열의 요소가 하나씩 매핑되어 뷰에 표시됨 -->
    <% drinks.forEach(function(drink) { %>   
        <li><%= drink.name %> - <%= drink.drunkness %></li>
    <% }); %>
</ul>
...
```
