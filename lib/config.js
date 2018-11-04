/*
 * Create and export configuration variables
 *
 */

// Dependencies
const secret = require('../secret');

const environments = {};

// Staging (default) environment
environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashingSecret': secret.hash.secret,
    'stripe': {
        'public': secret.stripe.public,
        'secret': secret.stripe.secret
    },
    'mailGun': {
        'domainName': secret.mailgun.domainName,
        'apiKey': secret.mailgun.apiKey,
        'from': secret.mailgun.from
    }
};

// Production environment
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': secret.hash.secret,
    'stripe': {
        'public': secret.stripe.public,
        'secret': secret.stripe.secret
    },
    'mailGun': {
        'domainName': secret.mailgun.domainName,
        'apiKey': secret.mailgun.apiKey,
        'from': secret.mailgun.from
    }
};

// Determinate which environment was passed as a command-line argument
const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not , default to staging
const environmentToExport = typeof (environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the environment
module.exports = environmentToExport;