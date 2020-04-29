#!/usr/bin/env node
var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.listen(6675, function () {
  console.log('Device Profiler listening on port 6675!')
})
var profilingServer = require('deviceprofiler').listen(app);

