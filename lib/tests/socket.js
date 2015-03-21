/**
 * Tests for feature socket-server:
 * 	1) Scenario: client connecting with the socket server.
 * 	2) Scenario: client receives events from socket server.
 * 	3) Scenario: socket server receives events from client.
 */


// Constants.
var CONFIG = require('../config/tests-config');

// Dependencies.
var http = require('http'),
    Client = require('socket.io-client'),
    socket = require('../index'),
    expect = require('chai').expect;

// Shut up JSHint.
/* global describe */
/* global before */
/* global it */
/* global after */

/**
 * Feature socket.
 *
 * The socket.io server.
 */
describe('Socket.', function () {
    before(function (done) {
        // Create a http server.
        var server = http.createServer();

        // Initialize the socket.io server.
        socket.init(server);

        // Let the http server listen on the port as specified in the tests
        // config.
        server.listen(CONFIG.port);

        // Expose the http server to the entire 'feature block'.
        this.server = server;

        // Expose the client to the entire 'feature block'.
        this.client = new Client(CONFIG.socketServer);

        done();
    });

    /**
     * 1) Scenario: client connecting with the socket server.
     *
     * A socket client should be able to successfully connect with the socket
     * server.
     *
     * When connected the socket server will emit the "connection" event with
     * the following event data:
     *
     * 		{
     * 			eventName: 'connection',
     * 			info: 'Client successfully connected.'
     * 		}
     */
    describe('Client connected.', function (done) {
        before(function (done) {
            this.client.on('connection', function (data) {
                // Expose the event data to the entire 'scenario block'.
                this.eventData = data;

                done();
            }.bind(this));
        });

        it('Socket server responds with event data object', function () {
            expect(this.eventData).to.be.an('object');
        });

        it('Event data object contains "eventName" property.', function () {
            expect(this.eventData).to.have.property('eventName');
        });

        it('Event data "eventName" is equal to "connection".', function () {
            expect(this.eventData.eventName).to.equal('connection');
        });

        it('Event data object contains "info" property.', function () {
            expect(this.eventData).to.have.property('info');
        });

        it('Event data "info" is equal to "Client successfully connected.".', function () {
            expect(this.eventData.info).to.equal('Client successfully connected.');
        });
    });

    /**
     * 2) Scenario: client receives events from socket server.
     *
     * A client connected to the socket server should be able to successfully
     * receive events from the socket server.
     *
     * The client will receive the the following event data:
     *
     * 		{
     * 			eventName: 'test',
     * 			info: 'Emitting test data.'
     * 		}
     */
    describe('Client receives events.', function (done) {
        before(function (done) {
            // Listen for the incoming test event.
            this.client.on('test', function (data) {
                // Expose the event data to the entire 'scenario block'.
                this.eventData = data;

                done();
            }.bind(this));

            // Emit the test event.
            socket.emit.client('test', {
                eventName: 'test',
                info: 'Emitted test data.'
            });
        });

        it('Client receives event data object', function () {
            expect(this.eventData).to.be.an('object');
        });

        it('Event data object contains "eventName" property.', function () {
            expect(this.eventData).to.have.property('eventName');
        });

        it('Event data "eventName" is equal to "test".', function () {
            expect(this.eventData).to.have.property('eventName');
            expect(this.eventData.eventName).to.equal('test');
        });

        it('Event data object contains "info" property.', function () {
            expect(this.eventData).to.have.property('info');
        });

        it('Event data "info" is equal to "Emitted test data.".', function () {
            expect(this.eventData.info).to.equal('Emitted test data.');
        });
    });

    /**
     * 3) Scenario: socket server receives events from client.
     *
     * A socket server connected to client should be able to successfully
     * receive events from the client.
     *
     * The socket server will receive the the following event data:
     *
     * 		{
     * 			eventName: 'test',
     * 			info: 'Emitting test data.'
     * 		}
     */
    describe('Socket server receives events.', function (done) {
        before(function (done) {
            // Listen for the incoming test event.
            socket.on('test', function (data) {
                // Expose the event data to the entire 'scenario block'.
                this.eventData = data;

                done();
            }.bind(this));

            // Emit the test event.
            this.client.emit('test', {
                eventName: 'test',
                info: 'Emitted test data.'
            });
        });

        it('Socket server receives event data object', function () {
            expect(this.eventData).to.be.an('object');
        });

        it('Event data object contains "eventName" property.', function () {
            expect(this.eventData).to.have.property('eventName');
        });

        it('Event data "eventName" is equal to "test".', function () {
            expect(this.eventData.eventName).to.equal('test');
        });

        it('Event data object contains "info" property.', function () {
            expect(this.eventData).to.have.property('info');
        });

        it('Event data "info" is equal to "Emitted test data.".', function () {
            expect(this.eventData.info).to.equal('Emitted test data.');
        });
    });

    after(function (done) {
        // Close the connection to the socket.io server.
        socket.close();

        // Close the connection to the http server.
        this.server.close(function () {
            done();
        });
    });
});
