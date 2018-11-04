/*
 * Pizza delivery - Homework Assignment #2
 * Autor Vladimir Velanac
 *
 */

// Dependency
const server = require('./lib/server');

// Application module class
const app = {};


// Init app
app.init = function() {
    server.init();
};

app.init();

// Instatniate and export application module
module.exports = app;