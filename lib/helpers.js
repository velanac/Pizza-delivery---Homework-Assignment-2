/*
 * Helpers for various tasks
 *
 */


// Dependencies
const _crypto = require('crypto');
const _config = require('./config');
const _https = require('https');
const _util = require('util');
const _debug = _util.debuglog('helpers');
const _querystring = require('querystring');

// Container for the helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = function(str) {
    if (typeof(str) == 'string' && str.length > 0) {
        const hash = _crypto.createHmac('sha256', _config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str) {
    try {
        const obj = JSON.parse(str);
        return obj;
    } catch (error) {
        return {};
    }
};

// Create a string of random alphanumenic characters, of a given lenght
helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters thet could to into a string
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the final string
        let str = '';
        for (let i = 1; i <= strLength; i++) {
            // Get a random character from the possibleCharacters string
            let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character the the final string
            str += randomCharacter;
        }

        // Return the final string
        return str;
    } else {
        return false;
    }
};

helpers.chargedCard = function(order, callback) {


    const postData = _querystring.stringify({
        amount: order.amount * 100,
        currency: 'usd',
        description: `Charge for ${order.user.email}`,
        source: order.stripeToken
    });

    const options = {
        protocol: 'https:',
        hostname: 'api.stripe.com',
        port: 443,
        method: 'POST',
        path: '/v1/charges',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            Authorization: `Bearer ${_config.stripe.secret}`
        }
    };

    const req = _https.request(options, (res) => {
        if (res.statusCode == 200 || res.statusCode == 201) {
            callback(false);
        } else {
            callback(res.statusCode);
        }
    });

    req.on('error', function(err) {
        _debug('Error: ', err);
    });

    req.write(postData);

    req.end();
};

helpers.sendReceiptMail = function(order, callback) {

    // Render message body
    const body = this.renderEmailMsg(order);

    // Data
    const postData = _querystring.stringify({
        from: _config.mailGun.from,
        to: order.user.email,
        subject: 'Payment Hot pizza',
        html: body
    });

    // Options
    const options = {
        protocol: 'https:',
        host: 'api.mailgun.net',
        path: `/v3/${_config.mailGun.domainName}/messages`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
            Authorization: 'Basic ' + Buffer.from('api:' + _config.mailGun.apiKey).toString('base64')
        }
    };

    const req = _https.request(options, (res) => {
        if (res.statusCode == 200 || res.statusCode == 201) {
            callback(false);
        } else {
            callback(res.statusCode);
        }
    });

    req.on('error', function(err) {
        _debug('Error: ', err);
    });

    req.write(postData);

    req.end();
};

helpers.renderEmailMsg = function (order) {
    let html = `<h1> Hot Pizza receipt</h1>`;
    
    html += `<p> Order date ${new Date(order.date).toLocaleTimeString()} </p>`;
    
    html +=  `<ul>`;
    
    order.menuItems.forEach(e =>{
        html += `<li> Pizza: ${e.name}  - Quantity: ${e.quantity} - Price: ${e.price} - Total: ${e.quantity * e.price} </li>`;
    });

    html += `</ul>`;

    html += `<h3> Order total ${order.amount} USD </h3>`;

    return html;
};

// Export the module
module.exports = helpers;