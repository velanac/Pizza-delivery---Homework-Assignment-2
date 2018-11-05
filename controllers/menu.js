/*
 * Menu controller
 *
 */

// Dependencies
const _util = require('util');
const _debug = _util.debuglog('menu');
const _data = require('../lib/data');
const _validators = require('../lib/validators');

// Instatiate UsersController
const MenuController = (data, callback) => {
    // Chosen method
    if (MenuController[data.method]) {
        MenuController[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Menu - get
// Required params: none
// Optional params: none
// Requires header: token
MenuController.get = function(data, callback) {
    // Read token
    const token = _validators.string(data.headers.token,20);
    const email = _validators.string(data.queryStringObject.email);

    if (token && email) {
        // Check authorization
        const verifyToken = () => {
            _data.verifyToken(token, email, (err) => {
                if (!err) {
                    // Read menu file
                    readMenuFile();
                } else {
                    // Shows errors in the console
                    _debug(err);
                    // Return error for user
                    callback(401);
                }
            });
        };
        // Read menu file
        const readMenuFile = () => {
            _data.read('menu', 'menu', (err, menuFile) => {
                if (!err) {
                    // Return menu
                    callback(200, menuFile);
                } else {
                    // Shows errors in the console
                    _debug('Error', error);
                    // Return error for client
                    callback(500);
                }
            });
        };
        // Run get menu
        verifyToken();
    } else {
        // Return error for user
        callback(401);
    }
};

// Export menu controller module
module.exports = MenuController;