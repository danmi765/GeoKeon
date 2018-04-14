const http = require('http');
const fs = require('fs');
// const querystring = require('querystring');
const url = require('url');
const port = 8000;

const server = http.createServer(function (request, response) {
    console.log('[server request.url:]', request.url);
    var domheader, dombody, entiredom, htmldom;
    if(request.url === '/'){
        fs.readFile('./pages/index.html', function(err, data) {
            console.log('-------[data]readhtml', data);
            response.setHeader('Content-type' , 'text/html');
            response.end(data);
        });
    }else{
        loadFileSystem(request.url);
    }


    function loadFileSystem(loadFile){
        // var param = querystring.parse(loadFile);
        var curURL = url.parse(loadFile);
        var curStr = url.format(curURL);
        var filePath = curURL.pathname;
        console.log('[loadFileSystem loadFile:]', curURL);
        fs.readFile('./pages' + filePath, function(err, data) {
            if (!err) {
                console.log('----------[!err]url:', loadFile);
                const idxDot = loadFile.lastIndexOf('.');
                const idxQuestion = loadFile.lastIndexOf('?');
                var idxType;

                if(idxQuestion == -1){
                    idxType = loadFile.substr(idxDot).toLowerCase();
                }else{
                    idxType = loadFile.substring(idxDot, idxQuestion).toLowerCase()
                }
                console.log('[idxType]', idxType);

                const mimetype = (idxDot == -1) ?
                    'text/html' : {
                        '.html' : 'text/html',
                        '.ico' : 'image/x-icon',
                        '.jpg' : 'image/jpeg',
                        '.png' : 'image/png',
                        '.gif' : 'image/gif',
                        '.css' : 'text/css',
                        '.js' : 'text/javascript',
                        '.map' : 'application/octet-stream'
                    }[ idxType ];
                response.setHeader('Content-type' , mimetype);
                response.end(data);
                console.log('[loadFileSystem:mimetype]', mimetype );
            } else {
                console.log('----------[err] file not found: ' + loadFile);
                console.log('error:', err);
                response.writeHead(404, "Not Found");
                response.end();
            }
        });
    }
});

//Listen on port 8000, IP defaults to 127.0.0.1
server.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);
