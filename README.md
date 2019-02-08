This library is of part of mediascape european project framework. Aims to facility on identifing different type of device using a long data base reforced with a intelligent learning system. It is capable to learn different patterns based on user-agent token. The API can identify the followings type of devices: desktop,tablet,mobile and TV, but it's open to identify much more devices Types.

### Installation

```bash

npm install deviceProfiler

```
Binary version:

```bash

sudo npm install deviceprofiler -g

```

### Usage

Standalone version:

```js

var deviceProfiler = require('deviceprofiler');
deviceProfiler.listen(8080);

```

Express version:

```js

var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
var profilingServer = require('deviceprofiler').listen(app);


```

### Web API

Identify device by user-agent:

```
 http://IP:PORT/checkDevice?agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/55.0.2883.87 Chrome/55.0.2883.87 Safari/537.36

```

Response:

```json
{"deviceType":"desktop","fiability":0.7865514693138671,"userAgent":"\"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/55.0.2883.87 Chrome/55.0.2883.87 Safari/537.36\""}

```

Is not identifying correctly ? Just give a chance to learn !

```
 http://IP:PORT/learn?device=Desktop&agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/55.0.2883.87 Chrome/55.0.2883.87 Safari/537.36

```

Will take awhile ... Response:

```json
{"learn":true}

```

### Import notes about learning

On time of learning, it's important to exit from terminal with Crtl + C and gives a response "Yes" to the question,
otherwise the new learns will not be saved (roadmap:To be improved).

It is not recommend to learn when server is on production.
