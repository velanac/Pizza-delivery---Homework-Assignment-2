/*
 * Users controller
 *
 */

// Dependencies
const _util = require('util');
const _debug = _util.debuglog('users');
const _data = require('../lib/data');
const _helpers = require('../lib/helpers');
const _validators = require('../lib/validators');
const PostUser = require('../models/PostUser').PostUser;
const GetUser = require('../models/GetUser').GetUser;
const PutUser = require('../models/PutUser').PutUser;

// Instatiate UsersController
const UsersController = (data, callback) => {
    if (UsersController[data.method]) {
        UsersController[data.method](data, callback);
    } else {
        callback(405);
    }
};
// Users - get
// Required params: email
// Optional params: none
// Required header: token
UsersController.get = (data, callback) => {
    // Check if email string is valid
    const email = _validators.string(data.queryStringObject.email);
    const token = _validators.string(data.headers.token, 20);
    // Check required params and token in header
    if (email || token) {
        // Token verification
        const verifyToken = () => {
            _data.verifyToken(token, email, (err) => {
                if (!err) {
                    // Read user file
                    readUser();
                } else {
                    // Shows errors in the console
                    _debug('Error: ', err);
                    // Return error for user
                    callback(401);
                }
            });
        };
        // Read user file
        const readUser = () => {
            _data.read('users', email, (err, userFile) => {
                if (!err && userFile) {
                    // Return response
                    callback(200, new GetUser(userFile));
                } else {
                    // Shows errors in the console
                    _debug('Error: ', err);
                    // Return error for user 
                    callback(404, { message: 'Not found' });
                }
            });
        };
        // Run token verification
        verifyToken();
    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }
};
// Users - post
// Required params: firstName, lastName, email, password, address, city
// Optional params: none
UsersController.post = function(data, callback) {
    // Get user data
    const newUser = new PostUser(data.payload, _validators);
    // Check if user data is valid
    if (newUser.isValid) {
        // Read if user exist
        const readUser = () => {
            _data.read('users', newUser.email, (err, userData) => {
                if (!err && userData) {                    
                    callback(400, { Error: 'A user with that email already exists' });
                } else {
                    // Shows errors in the console
                    _debug('Error: ', err);
                    // Create new user
                    createUser();
                }
            });
        };
        // Create new user
        const createUser = () => {
            // Hash password
            newUser.hasedPassword = _helpers.hash(newUser.password);
            // Remove passwod form user object
            delete newUser.password;
            // Create user file
            _data.create('users', newUser.email, newUser, (err, newUserData) => {
                if (!err) {
                    // Return success
                    callback(200, new GetUser(newUserData));
                } else {
                    // Shows errors in the console
                    _debug('Error: ', err);
                    // Return error for user
                    callback(500, { Error: 'Could not create the new user' });
                }
            });
        };
        // Run read user
        readUser();
    } else {
        callback(400, { Error: "Missing all required parametar" });
    }
};
// Users - put
// Required params: email
// Optional params: firstName, lastName, address, city
// Require headers: tokon
UsersController.put = function(data, callback) {
    // Validate require
    const email = _validators.string(data.payload.email);
    const token = _validators.string(data.headers.token, 20);
    // Get fields for update
    const putData = new PutUser(data.payload);
    // Check if email exist and return error if not
    if (email || token) {
        // Validate put data
        if (putData.isValid) {
            // Validate user tokent
            const validateToken = () => {
                _data.verifyToken(token, email, (err) => {
                    if (!err) {
                        // Read user from file
                        readUser();
                    } else {
                        callback(401);
                    }
                });
            };
            // Read user data
            const readUser = () => {
                _data.read('users', email, (err, userFile) => {
                    if (!err && userFile) {
                        // Update user data
                        userFile = putData.update(userFile);
                        // Update file
                        updateUser(userFile);
                    } else {
                        // Shows errors in the console
                        _debug(err);
                        // Return error for user
                        callback(404, { Error: 'User not found' });
                    }
                });
            };
            // Update user file
            const updateUser = (userFile) => {
                _data.update('users', email, userFile, (err, data) => {
                    if (!err && data) {
                        // Return response
                        callback(200, new GetUser(data));
                    } else {
                        // Shows errors in the console
                        _debug(err);
                        // Return error for user
                        callback(400, { Error: 'Could not update user' });
                    }
                });
            }
            validateToken();
        } else {
            // Return error if update fiels is empty
            callback(400, { Error: 'Missing fields to update' });
        }
    } else {
        // Return error missing required parameter
        callback(200, { Error: 'Missing required fields' });
    }
};
// Users - delete
// Required params: email
// Optional params: none
// Required header: token 
UsersController.delete = function(data, callback) {
    // Check and get email
    const email = _validators.string(data.queryStringObject.email);
    const token = _validators.require(data.headers.token);
    // Check if email exist and return error if not
    if (email || token) {
        // Verify user token
        const verifyToken = () => {
            _data.verifyToken(token, email, (err) => {
                if (!err) {
                    // Read user from file
                    deleteUser();
                } else {
                    callback(401);
                }
            });
        };
        // Delete user
        const deleteUser = () => {
            _data.delete('users', email, (err) => {
                if (!err) {
                    callback(200);
                } else {
                    // Shows errors in the console
                    _debug(err);
                    // Return error for the user
                    callback(404, { Error: 'User not found' });
                }
            });
        };
        // Run verify token
        verifyToken();
    } else {
        // Return error for the user
        callback(400, { Error: 'Missing required fields' });
    }
};
// Exports controller
module.exports = UsersController;