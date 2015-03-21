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
var express = require('express'),
	http = require('http'),
	socket = require('socket-io-server'),
	app = express(),
	server = http.Server(app);

socket.init(server);

// Listen for incoming events from a client.
socket.on('incoming', function (data) {
	// Data! :)
});

// Emit an event to a specific client.
socket.emit.client('emit-client', {
	data: []
});

// Emit an event to all connected clients.
socket.emit.clients('emit-clients', {
	data: []
});

// Close the socket server connection.
socket.close();
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
