var http = require('http'),
    PORT = 8000,
    finalhandler = require('finalhandler'),
    serveStatic = require('serve-static'),
    serve = serveStatic("./build");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

server.listen(PORT, function(){
    console.log('server listning on port', PORT);
});