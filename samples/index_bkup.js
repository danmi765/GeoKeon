const http = require('http');
const fs = require('fs');
const header = require('./AppClient_header')
const body = require('./AppClient_body')
const port = 8000;

const server = http.createServer(function (request, response) {
    console.log('[server request.url:]', request.url);
    var domheader, dombody, entiredom, htmldom;
    domheader = header.domheader;
    dombody = body.dombody;
    if(request.url === '/'){
        entiredom = domheader + dombody;
        // htmldom = Buffer.from(new String(entiredom)); Case 1
        // htmldom = Buffer.from(entiredom); Case 2
        htmldom = entiredom; // Case 3
        response.setHeader('Content-type' , 'text/html');
        response.end(htmldom);
    }else{
        loadFileSystem(request.url);
    }

    function loadFileSystem(loadFile){
        console.log('[loadFileSystem loadFile:]', loadFile);
        fs.readFile('./' + loadFile, function(err, data) {
            console.log('[loadFileSystem data:]', data);
            if (!err) {
                const dotoffset = request.url.lastIndexOf('.');
                const mimetype = (dotoffset == -1) ?
                'text/html' : {
                    '.html' : 'text/html',
                    '.ico' : 'image/x-icon',
                    '.jpg' : 'image/jpeg',
                    '.png' : 'image/png',
                    '.gif' : 'image/gif',
                    '.css' : 'text/css',
                    '.js' : 'text/javascript'
                }[ request.url.substr(dotoffset) ];
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
