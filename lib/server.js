/*
 * Server tasks module
 *
 */

// Dependency
const _http = require('http');
const _https = require('https');
const _url = require('url');
const _fs = require('fs');
const _path = require('path');
const _environment = require('./config');
const _commonController = require('../controllers/common');
const _usersController = require('../controllers/users');
const _tokensController = require('../controllers/tokens');
const _menuController = require('../controllers/menu');
const _ordersController = require('../controllers/orders');
const _cartsController = require('../controllers/carts');
const _helpers = require('./helpers');
const _util = require('util');
const _debug = _util.debuglog('server');
const StringDecoder = require('string_decoder').StringDecoder;

// Server module
const server = {};

// Instantiate HTTP server
server.httpServer = _http.createServer((req, res) => {
    server.unifiedServer(req, res);
});

// Instantiate HTTPS server
const httpServerOptions = {
    key: _fs.readFileSync(_path.join(__dirname, '/../https/key.pem')),
    cert: _fs.readFileSync(_path.join(__dirname, '/../https/cert.pem'))
};

server.httpsServer = _https.createServer(httpServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});


server.init = () => {
    // Init http listener
    server.httpServer.listen(_environment.httpPort, () => {
        console.log('\x1b[36m%s\x1b[0m', `The http server is listening on port ${_environment.httpPort}`);
    });

    // Init https listener
    server.httpsServer.listen(_environment.httpServer, () => {
        console.log('\x1b[35m%s\x1b[0m', `The https server is listening on port ${_environment.httpsPort}`);
    });
};

server.unifiedServer = function(req, res) {
    // Get the URL and parse it
    const parsedUrl = _url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get query string as an object
    const queryStringObject = parsedUrl.query;

    // Get http Method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', function(data) {
        buffer += decoder.write(data);
    });

    req.on('end', function() {
        buffer += decoder.end();

        // Choose the handler request shuld go to. If one is not return not found.
        const chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : _commonController;

        // Constract the data object to send to the handler
        const data = {
            trimmedPath: trimmedPath,
            queryStringObject: queryStringObject,
            method: method,
            headers: headers,
            payload: _helpers.parseJsonToObject(buffer)
        };


        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);

            // Send the respose
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // If the respose is 200, print green otherwise print red
            if (statusCode == 200) {
                _debug('\x1b[32m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            } else {
                _debug('\x1b[31m%s\x1b[0m', method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode);
            }
        });
    });
};

// Define a request router
server.router = {
    ping: _commonController,
    users: _usersController,
    tokens: _tokensController,
    menu: _menuController,
    carts: _cartsController,
    orders: _ordersController
};

// Exports server module
module.exports = server;