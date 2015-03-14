/**
 * @module Socket
 *
 * Provides a simple abstraction for initializing- and connecting to a socket.io
 * server.
 *
 * This module creates a singleton Object that exposes methods for listening to
 * and emitting socket events using an existing http Server Object.
 *
 * Usage:
 * ```javascript
 * 	var express = require('express'),
 * 		http = require('http'),
 * 		socket = require('./socket'),
 * 		app = express(),
 * 		server = http.Server(app);
 *
 * 	socket.init(server);
 *
 * 	// Listen for incoming events from a client.
 * 	socket.on('incoming', function (data) {
 * 		// Data! :)
 * 	});
 *
 * 	// Emit an event to a specific client.
 * 	socket.emit.client('emit-client', {
 * 		data: []
 * 	});
 *
 * 	// Emit an event to all connected clients.
 * 	socket.emit.clients('emit-clients', {
 * 		data: []
 * 	});
 *
 * 	// Close the socket server connection.
 * 	socket.close();
 * ```
 */

// Dependencies.
var SocketServer = require('socket.io'),
    debug = require('debug')('socket-server:socket');

// Socket Contructor.
var Socket = new Function();

// Socket prototype.
Socket.prototype = {
    constructor: Socket,

    /**
     * Initialize socket.io server.
     *
     * @param  {Object} server - http server
     */
    init: function (server) {
        this.connect(new SocketServer(server));
    },

    /**
     * Establish a socket connection.
     *
     * @param  {Object} socketServer - socket.io server (SocketServer instance)
     */
    connect: function (socketServer) {
        // Expose the socketServer object.
        this.socketServer = socketServer;

        // Listen for when a client connects with the socket.io server.
        socketServer.on('connection', function (socket) {
            debug('socketServer event "connection".');

            // Emit a custom event to the connected client on connection.
            socket.emit('connection', {
                eventName: 'connection',
                info: 'Client successfully connected.'
            });

            // Listen for when a client disconnects with the socket.io server.
            socket.on('disconnect', function () {
                // Emit a custom event to the all connected clients when a
                // specific client disconnects.
                socketServer.emit('disconnect', {
                    eventName: 'disconnect',
                    info: 'Client disconnected.'
                });
            });

            // Expose the socket.
            this.socket = socket;

            // Expose the 'emit' functions for easy access.
            this.emit = {
                /**
                 * Emit an event to a specific client.
                 *
                 * @method
                 */
                client: function () {
                    socket.emit.apply(socket, arguments);
                },

                /**
                 * Emit an event to all connected clients.
                 * @type {[type]}
                 */
                clients: function () {
                    socketServer.emit.apply(socketServer, arguments);
                },
            };

            // Expose the 'on' function for easy access.
            this.on = function () {
                socket.on.apply(socket, arguments);
            };
        }.bind(this));
    },

    /**
     * Close the socket server connection.
     *
     * @method
     */
    close: function () {
        this.socketServer.close();
    }
};

/**
 * Export the Socket module instance.
 *
 * @type {Object}
 */
module.exports = new Socket();
