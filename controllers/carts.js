/*
 * Cards controller
 * Method: get, post, delete
 */

// Dependencies
const _util = require('util');
const _debug = _util.debuglog('cards');
const _data = require('../lib/data');
const _validators = require('../lib/validators');
const GetUser = require('../models/GetUser').GetUser;
const Carts = require('../models/Carts').Carts;

// Instatiate CartsController
const CartsController = function(data, callback) {
    if (CartsController[data.method]) {
        CartsController[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Get cards
// Required params: email
// Optional params: none
// Required header: token
CartsController.get = function(data, callback) {
    const token = _validators.string(data.headers.token, 20);
    const email = _validators.string(data.queryStringObject.email);

    if (token && email) {
        // Verification token
        const verifyToken = () => {
            _data.verifyToken(token, email, (err) => {
                if (!err) {
                    // Read user carts
                    readUserCarts();
                } else {
                    // Show error in the console
                    _debug('Error: ', err)
                    // Returns error for client
                    callback(401);
                }
            });
        };
        // Read user carts file
        const readUserCarts = () => {
            _data.read('carts', email, (err, cartsFile) => {
                if (!err) {
                    // Success response
                    callback(200, cartsFile)
                } else {
                    // Show error in the console
                    _debug('Error: ', err)
                    // Returns a user error
                    callback(404);
                }
            });
        };
        // Run get carts
        verifyToken();
    } else {
        callback(400, { Error: 'Missing required fields' });
    }
};

// Post - carts
// Required params: email, pizzaName
// Optional params: none
// Required header: token
CartsController.post = function(data, callback) {
    const token = _validators.string(data.headers.token, 20);
    const email = _validators.string(data.payload.email);
    const pizzaName = _validators.string(data.payload.pizzaName);

    if (token) {
        if (pizzaName && email) {
            // Global function varible
            let menuItem;
            // Verify authorization
            const verifyToken = () => {
                _data.verifyToken(token, email, (err) => {
                    // Return error if not exists token or the token expires
                    if (!err) {
                        // Read pizza menu file
                        readMenu();
                    } else {
                        // Show error in the console
                        _debug('Error: ', err)
                        // Returns a user error
                        callback(401);
                    }
                });
            };
            // Read pizza menu
            const readMenu = () => {
                _data.read('menu', 'menu', (err, menuFile) => {
                    if (!err && menuFile) {
                        // Store meni items
                        menuItem = menuFile.find(e => e.name.toUpperCase() == pizzaName.toUpperCase());
                        if (menuItem !== undefined) {
                            // Read carts file
                            readUserCarts();
                        } else {
                            // Returns an error if it does not exist pizza
                            callback(404, { 'Error': 'Menu item not found' });
                        }
                    } else {
                        // Show error in the console
                        _debug('Error: ', err)
                        // Returns a user error
                        callback(500);
                    }
                });
            };
            // Read read user carts
            const readUserCarts = () => {
                _data.read('carts', email, (err, cartsFile) => {
                    // Update if carts exists. Create new carts if carts not exists.
                    if (!err && cartsFile) {
                        const updateCarts = new Carts(cartsFile);
                        // Add pizza to carts
                        updateCarts.addOrUpdateQuantityItem(menuItem);
                        // Update carts file
                        updateUserCarts(updateCarts);
                    } else {
                        // Read user data
                        readUserFile();
                        // Show error in the console
                        _debug('Error: ', err)
                    }
                });
            };
            // Update user carts
            const updateUserCarts = (updateCarts) => {
                _data.update('carts', email, updateCarts, (err, updateFile) => {
                    if (!err && updateFile) {
                        // Return success response
                        callback(200, updateFile);
                    } else {
                        // Show error in the console
                        _debug('Error: ', err)
                        // Return error
                        callback(500, { Error: 'Could not update carts' });
                    }
                });
            };
            // Read user file if carts not exist
            const readUserFile = () => {
                _data.read('users', email, (err, userFile) => {
                    if (!err && userFile) {
                        // Create carts
                        createNewCarts(userFile);
                    } else {
                        // Show error in the console
                        _debug('Error: ', err)
                        // Return error if user not exist
                        callback(404, { Error: 'User not found' });
                    }
                });
            };
            // Create new carts for user
            const createNewCarts = (userFile) => {
                const saveUser = new GetUser(userFile);
                // Create new cart
                newCart = new Carts({ user: saveUser });
                // Add pizza from menu or update quantity
                newCart.addOrUpdateQuantityItem(menuItem);
                // Create new file
                _data.create('carts', email, newCart, (err, newCart) => {
                    if (!err) {
                        callback(200, newCart);
                    } else {
                        // Show error in the console
                        _debug('Error: ', err);
                        // Return error for client
                        callback(500, { Error: 'Could not create new carts' });
                    }
                });
            };
            // Run post new menu item
            verifyToken();
        } else {
            // Return error for client
            callback(400, { 'Error': 'Missing required fields' });
        }
    } else {
        // Return error for client
        callback(401);
    }
};

// Delete - carts
// Required params: email, pizzaName
// Optional params: none
CartsController.delete = function(data, callback) {
    const token = _validators.string(data.headers.token, 20);
    const email = _validators.string(data.payload.email);
    const pizzaName = _validators.string(data.payload.pizzaName);

    if (token) {
        if (pizzaName && email) {
            // Verify token data
            const verifyToken = () => {
                _data.verifyToken(token, email, (err) => {
                    if (!err) {
                        // Read read carts
                        readUserCarts();
                    } else {
                        // Show error in the console
                        _debug('Error: ', err)
                        // Returns a user error
                        callback(401);
                    }
                });
            };
            // Read carts
            const readUserCarts = () => {
                _data.read('carts', email, (err, cartsFile) => {
                    if (!err && cartsFile) {
                        // Remove item or correct quantity
                        const updateCarts = new Carts(cartsFile);
                        const menuItem = updateCarts.getItem(pizzaName);
                        if (menuItem) {
                            updateCarts.removeItem(pizzaName);
                            updateCartsFile(updateCarts);
                        } else {
                            callback(404, "Carts item not found");
                        }
                    } else {
                        // Show error in the console
                        _debug('Error: ', err)
                        // Returns a user error
                        callback(404, { Error: 'Carts not found' });
                    }
                });
            };
            // Update carts file
            const updateCartsFile = (updateCarts) => {
                _data.update('carts', updateCarts.user.email, updateCarts, (err, cartsFile) => {
                    if (!err && cartsFile) {
                        // Return success with new carts
                        callback(200, cartsFile);
                    } else {
                        // Show error in the console
                        _debug('Error: ', err);
                        // Return error for client
                        callback(500, { Error: 'Could not delete carts item' });
                    }
                });
            };
            // Run remove item form carts
            verifyToken();
        } else {
            // Return error for client
            callback(400, { 'Error': 'Missing required fields' });
        }
    } else {
        // Return error for client
        callback(401);
    }
};
// Export carts controller module
module.exports = CartsController;