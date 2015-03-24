# socket-io-server.
Provides a simple abstraction for initializing- and connecting to a socket.io server.

This module creates a singleton Object that exposes methods for listening to
and emitting socket events using an existing http Server Object.

## Installing.
```bash
npm install socket-io-server
```

## Usage.
```javascript
// Dependencies.
var express = require('express'),
	http = require('http'),
	socket = require('socket-io-server'),
	app = express(),
	server = http.Server(app);

// Initialize socket server.
socket.init(server);

// Initialize http server.
server.listen(8080);

// Listen for incoming events from a client.
socket.on('incoming', function (data) {
	// Data! :)
});

// Emit an event with data to a specific client.
socket.emit.client('emit-client', {
	data: []
});

// Emit an event with data to all connected clients.
socket.emit.clients('emit-clients', {
	data: []
});

// Access the socket.io socket object.
socket.socket;

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
var express = require('express'),
	http = require('http'),
	socket = require('socket-io-server'),
	app = express(),
	server = http.Server(app);

socket.init(server);
server.listen(8080);

// 'lib/sub-module.js'
var socket = require('socket-io-server');

socket.emit.client('emit-client', {
	data: []
});

// 'lib/sub-module-2.js'
var socket = require('socket-io-server');

socket.on('incoming', {
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
