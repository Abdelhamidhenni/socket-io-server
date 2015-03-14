/**
 * @module Tests Config.
 *
 *
 * Socket server tests configuration.
 */

// Constants.
var PORT = 9999;

/**
 * Export the configuration.
 *
 * @type {Object}
 */
module.exports = {
    port: PORT,
    socketServer: 'http://localhost:' + PORT
};
