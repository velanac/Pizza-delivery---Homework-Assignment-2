/*
 * Tokens controller
 *
 */

// Dependencies
const util = require('util');
const debug = util.debuglog('tokens');
const _data = require('../lib/data');
const _helpers = require('../lib/helpers');
const _validators = require('../lib/validators');
const PostToken = require('../models/PostToken').PostToken;

// Instatiate TokensController
const TokensController = function(data, callback) {

    if (TokensController[data.method]) {
        TokensController[data.method](data, callback);
    } else {
        callback(405);
    }

};

// Tokens - post
// Required params: email, password
// Optional params: none
TokensController.post = function(data, callback) {
    // Get email and password
    const postData = new PostToken(data.payload, _validators);
    // Check are email and password valid format
    if (postData.isValid) {
        // Read user file
        const readUserFile = () => {
            _data.read('users', postData.email, (err, userData) => {
                if (!err) {
                    // Hash the send password
                    const hasedPassword = _helpers.hash(postData.password);
                    // Check if the passord is correct
                    if (userData.hasedPassword === hasedPassword) {
                        const tokenId = _helpers.createRandomString(20);
                        const expires = Date.now() + 1000 * 60 * 60;
                        const tokenObject = {
                            'email': postData.email,
                            'id': tokenId,
                            'expires': expires
                        };
                        // Create token file
                        createToken(tokenObject);
                    } else {
                        callback(400, { 'Error': 'Password did not match the specified user' });
                    }
                } else {
                    // Shows errors in the console
                    debug('Error: ', err);
                    // Returns an error if the user does not exist
                    callback(400, { 'Error': 'Could not find the specified user' });
                }
            });
        }
        // Create new token
        const createToken = (tokenObject) => {
            _data.create('tokens', tokenObject.id, tokenObject, (err) => {
                if (!err) {
                    callback(200, tokenObject);
                } else {
                    // Show error in the console
                    debug('Error: ', err)
                    // Returns a user error
                    callback(500, { 'Error': 'Oops, something went wrong, try again' });
                }
            });
        };
        readUserFile();
    } else {
        callback(400, { 'Error': "Missing required parametar(s)" });
    }
};

// Tokens - get
// Required data: id
// Optional data: none
TokensController.get = function(data, callback) {
    // Check if id is valid
    const id = _validators.string(data.queryStringObject.id, 20);

    if (id) {
        // Check if token exist
        _data.read('tokens', id, (err, token) => {
            if (!err) {
                // Success response
                callback(200, token);
            } else {
                // Shows errors in the console
                debug('Error: ', error);
                // Error for user
                callback(404, { 'Error': 'Token not found' });
            }
        });
    } else {
        callback(400, { 'Error': 'Id number is not valid' });
    }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
TokensController.put = function(data, callback) {
    // Check if id and extend is valid
    const id =  _validators.string(data.payload.id);
    const extend =  _validators.boolean(data.payload.extend)

    if (id && extend) {
        // Read token
        const readToken = () => {
            _data.read('tokens', id, (err, tokenData) => {
                if (!err) {
                    // Check to the make sure the token isn't already expired
                    if (tokenData.expires > Date.now()) {
                        // Extended token
                        tokenData.expires = Date.now() + 1000 * 60 * 60;
                        // Store update token
                        updateToken(tokenData);
                    } else {
                        callback(400, { 'Error': 'The token has already expired and cannot be extended' });
                    }
                } else {
                    // Shows errors in the console
                    debug('Error: ', err);
                    // Error for user
                    callback(404, { 'Error': 'Token not found' });
                }
            });
        }
        // Update token file
        const updateToken = (tokenData) => {
            _data.update('tokens', id, tokenData, (err, updateData) => {
                if (!err) {
                    // Return success respons
                    callback(200, updateData);
                } else {
                    // Shows errors in the console
                    debug('Error: ', err);
                    // Error for user
                    callback(500, { 'Error': 'Could not update the token\'s expiration' });
                }
            });
        };
        // Run extends token
        readToken();
    } else {
        callback(400, { 'Error': 'Missing required fild(s) of fild(s) is invalid' });
    }
};

// Tokens - delete
// Required fields: id
// Optional data: none
TokensController.delete = function(data, callback) {
    // Check if id is valid
    const id =  _validators.string(data.queryStringObject.id, 20);

    if (id) {
        // Check if token exist
        const readToken = () => {
            _data.read('tokens', id, (err) => {
                if (!err) {
                    deleteToken();
                } else {
                    // Shows errors in the console
                    debug('Error: ', err);
                    // Error for user
                    callback(404, { 'Error': 'Token not found' });
                }
            });
        };
        // Delete token file
        const deleteToken = () => {
            _data.delete('tokens', id, (err) => {
                if (!err) {
                    callback('200');
                } else {
                    // Shows errors in the console
                    debug('Error: ', err);
                    // Error for user
                    callback(500, { 'Error': 'Could not delete the specified token' });
                }
            });
        };
        // Run token delete
        readToken();
    } else {
        callback(400, { 'Error': 'Missing required field' });
    }
};

// Export token controller module
module.exports = TokensController;