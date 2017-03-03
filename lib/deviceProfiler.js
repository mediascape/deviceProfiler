var express = require('express');
var log4js = require('log4js');
log4js.configure({ // configure to use all types in different files.
  appenders: [
        { type: "console"}
      ],
  replaceConsole: true
});
var logger = log4js.getLogger('Device Profiler');

var Server = function(_app){
var deviceProfiler = require('./lib/deviceProfiling');
if (_app && ('number' ==  typeof _app)){
   app = express();
   app.listen(_app, function () {
    var host = this.address().address;
    var port = this.address().port;
    logger.info('Server listening at http://%s:%s', host, port);
  });
}
if (typeof _app == "function" ) app = _app;
app.use( function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
app.get('/checkDevice', function(req, res) {
  var result = deviceProfiler.checkDevice(req.query.agent,logger);
  res.send(result);
});
app.get('/learn', function(req, res) {
  var result = deviceProfiler.learn(req.query.agent,req.query.device);
  res.send({"learn":true});
});


}
exports.listen = Server;
