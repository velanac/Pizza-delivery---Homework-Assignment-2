/*
 * Orders controller
 *
 */

// Dependencies
const _util = require('util');
const _debug = _util.debuglog('orders');
const _data = require('../lib/data');
const _helpers = require('../lib/helpers');
const _validators = require('../lib/validators');
const Order = require('../models/Order').Order;

// Instatiate OrdersController
const OrdersController = (data, callback) => {

    if (OrdersController[data.method]) {
        OrdersController[data.method](data, callback);
    } else {
        callback(405);
    }

};

// Post order
// Required params: none
// Optional params: none
// Required header: token
OrdersController.post = function(data, callback) {
    const token = _validators.string(data.headers.token, 20);
    const email = _validators.string(data.payload.email);
    const stripeToken = _validators.string(data.payload.stripeToken);

    if (token && stripeToken) {
        // Verification token
        const verifyToken = () => {
            _data.verifyToken(token, email, (err, tokenFile) => {
                if (!err && tokenFile) {
                    // Read user carts
                    readUserCarts(tokenFile);
                } else {
                    // Show error in the console
                    _debug('Error: ', err);
                    // Returns error for client
                    callback(401);
                }
            });
        };
        // Read user carts
        const readUserCarts = (tokenFile)  => {
            _data.read('carts', tokenFile.email, (err, cartsFile) => {
                if (!err && cartsFile) {
                    // Create order from carts, add order id and stripe token
                    cartsData = cartsFile;
                    newOrder = new Order(cartsFile);
                    newOrder.id = newOrder.user.email + '_' + _helpers.createRandomString(5);
                    newOrder.stripeToken = stripeToken;
                    // Charge card
                    chargedCard(newOrder);
                } else {
                    // Show error in the console
                    _debug('Error: ', err);
                    // Returns a user error
                    callback(404, { 'Error': 'Carts for user not found' });
                }
            });
        };
        // Charged card
        const chargedCard = (newOrder) => {
            _helpers.chargedCard(newOrder, (err) => {
                if (!err) {
                    // If success charged card create new order id and save order
                    createOrder(newOrder);
                } else {
                    callback(400, { Error: 'Charged card error' });
                }
            });
        };
        // Create order file
        const createOrder = (newOrder) => {
            _data.create('orders', newOrder.id, newOrder, (err, orderFile) => {
                if (!err && orderFile) {
                    // Delete user carts
                    deleteCarts(newOrder);
                } else {
                    // Show error in the console
                    _debug('Error: ', err);
                    // Returns error for client
                    callback(500, { Error: '' });
                }
            });
        };
        // Delete rezlized card
        const deleteCarts = (newOrder) => {
            _data.delete('carts', newOrder.user.email, (err) => {
                if (!err) {
                    sendMailToUser(newOrder);
                } else {
                    // Show error in the console
                    _debug('Error: ', err);
                    // Returns error for client
                    callback(500, { Error: 'Error during billing' });
                }
            });
        };
        // Send mail
        const sendMailToUser = (newOrder) => {
            _helpers.sendReceiptMail(newOrder, (err) => {
                if (!err) {
                    callback(200, newOrder);
                } else {
                    // Show error in the console
                    _debug('Error: ', err);
                    // Returns error for client
                    callback(500, { Error: 'Error sending mail' });
                }
            });
        };
        // Run create order
        verifyToken();
    } else {
        callback(401);
    }
}
// Export order controller module
module.exports = OrdersController;