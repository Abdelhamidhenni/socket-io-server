/**
 * @module Socket
 *
 * Provides a simple abstraction for initializing- and connecting to a socket.io
 * server.
 *
 * This module creates a singleton Object that exposes methods for listening to
 * and emitting socket events using an existing http Server Object.
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
     * @method
     *
     * @param  {Object} server - http server
     */
    init: function (server) {
        this.connect(new SocketServer(server));
    },

    /**
     * Establish a socket connection.
     *
     * @method
     *
     * @param  {Object} socketServer - socket.io server (SocketServer instance)
     */
    connect: function (socketServer) {
        /**
         * Expose the socketServer object (socket.io constructor).
         *
         * @property
         */
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

            /**
             * Expose the socket object (socket.io socket).
             *
             * @property
             */
            this.socket = socket;

            /**
             * Expose the 'emit' functions for easy access.
             *
             * @property
             */
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
                 *
                 * @method
                 */
                clients: function () {
                    socketServer.emit.apply(socketServer, arguments);
                },
            };

            /**
             * Expose the 'on' function for easy access.
             *
             * @method
             */
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
