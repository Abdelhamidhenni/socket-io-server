# socket-io-server.
Provides a simple abstraction for initializing- and connecting to a socket.io server.

This module creates a singleton Object that exposes methods for listening to
and emitting socket events using an existing http Server Object.

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]] [travis-url]

[npm-image]: https://img.shields.io/badge/npm-v0.0.4-blue.svg
[npm-url]: https://www.npmjs.com/package/socket-io-server
[travis-image]: https://travis-ci.org/danillouz/socket-io-server.svg?branch=master
[travis-url]: https://travis-ci.org/danillouz/socket-io-server

## Installing.
```bash
npm install socket-io-server
```

## Usage.
```javascript
// Dependencies.
var express = require('express');
var	http = require('http');
var	socket = require('socket-io-server');
var	app = express();
var	server = http.Server(app);

// Initialize socket server.
socket.init(server);

// Initialize http server.
server.listen(8080);

// Listen for incoming events from a client.
// Note that a web socket client id is required, this id is emitted by the
// socket server when a client connects.
socket.on('ws-client-id', 'incoming', function (data) {
	// Data! :)
});

// Emit an event with data to all connected clients except for the
// client that started the event.
// Note that a web socket client id is required, this id is emitted by the
// socket server when a client connects.
socket.broadcast('ws-client-id', 'emit-client', {
	data: []
});

// Emit an event with data to a specific client.
// Note that a web socket client id is required, this id is emitted by the
// socket server when a client connects.
socket.emit('ws-client-id', 'emit-client', {
	data: []
});

// Emit an event with data to all connected clients.
socket.emitAll('emit-clients', {
	data: []
});

// Access the socketServer object (socket.io constructor).
socket.socketServer;

// Close the socket server connection.
socket.close();

// Close the http server connection.
server.close();
```

Because the module returns a singleton, the socket server only needs to be
initialized once and can then be required from any (sub) module(s) to emit- and
listen for socket events.

```javascript
// 'lib/index.js'
var express = require('express');
var	http = require('http');
var	socket = require('socket-io-server');
var	app = express();
var	server = http.Server(app);

socket.init(server);
server.listen(8080);

// 'lib/sub-module.js'
var socket = require('socket-io-server');

socket.broadcast('ws-client-id', 'emit-client', {
	data: []
});

// 'lib/sub-module-2.js'
var socket = require('socket-io-server');

socket.on('ws-client-id', 'incoming', {
	data: []
});
```

## Testing.
```bash
npm test
```

## Code coverage.
Generated code coverage reports are based on written tests and are generated
after running the tests suite.

Reports can be found in:
```
/coverage/lcov-report/
```

## Linting.
JSHint is used to lint all javascript code prior running tests using the npm
'pretest' hook.

## Dependencies.
* [socket.io](https://github.com/Automattic/socket.io)
