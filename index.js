const http = require('http');
const fs = require('fs');
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
        console.log('[loadFileSystem loadFile:]', loadFile);
        fs.readFile('./pages' + loadFile, function(err, data) {
            if (!err) {
                const dotoffset = request.url.lastIndexOf('.');
                console.log('[loadFileSystem dotoffset:]', dotoffset);
                const mimetype = (dotoffset == -1) ?
                'text/html' : {
                    '.html' : 'text/html',
                    '.ico' : 'image/x-icon',
                    '.jpg' : 'image/jpeg',
                    '.png' : 'image/png',
                    '.gif' : 'image/gif',
                    '.css' : 'text/css',
                    '.js' : 'text/javascript',
                    '.map' : 'application/octet-stream'
                }[ request.url.substr(dotoffset).toLowerCase() ];
                response.setHeader('Content-type' , mimetype);
                response.end(data);
                console.log('[loadFileSystem:mimetype]', mimetype );
            } else {
                console.log ('file not found: ' + request.url);
                response.writeHead(404, "Not Found");
                response.end();
            }
        });
    }
});

//Listen on port 8000, IP defaults to 127.0.0.1
server.listen(port);

console.log(`Server running at http://127.0.0.1:${port}/`);
