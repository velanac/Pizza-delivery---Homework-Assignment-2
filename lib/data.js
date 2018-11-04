/*
 * Library for storing and editing data.
 *
 */

const _fs = require('fs');
const _path = require('path');
const _helpers = require('./helpers');

// Container for the module (to be exported)
let lib = {};

// Base directory of the data folder
lib.baseDir = _path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
    // Open file
    const openFile = () => {
        _fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
                // Conver data to string
                stringData = JSON.stringify(data);
                // Write file
                writeFile(fileDescriptor, stringData);
            } else {
                callback(true, 'Could not create new file, it may already exist');
            }
        });
    };
    // Write file
    const writeFile = (fileDescriptor, stringData) => {
        _fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
                // Close file
                closeFile(fileDescriptor);
            } else {
                callback(true, 'Error writing to new file');
            }
        });
    };
    // Close file
    const closeFile = (fileDescriptor) => {
        _fs.close(fileDescriptor, (err) => {
            if (!err) {
                const parseData = _helpers.parseJsonToObject(stringData)
                callback(false, parseData);
            } else {
                callback(true, 'Error closing new file');
            }
        });
    };
    // Start create file
    openFile();
};

// Read data from a file
lib.read = function(dir, file, callback) {
    // Read file
    _fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', (err, data) => {
        if (!err && data) {
            // Parse file data to JSON
            const parseData = _helpers.parseJsonToObject(data);
            callback(false, parseData);
        } else {
            callback(err, data);
        }
    });
};

// Update data inside a file
lib.update = function(dir, file, data, callback) {
    const stringData = JSON.stringify(data);
    // Open file
    const openFile = () => {
        _fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
                truncateFile(fileDescriptor)
            } else {
                callback('Could not open the file for updating, it may not exist yet');
            }
        })
    };
    // Truncate file
    const truncateFile = (fileDescriptor) => {
        _fs.truncate(fileDescriptor, (err) => {
            if (!err) {
                // If no error write file
                writeFile(fileDescriptor);
            } else {
                callback('Error truncating file');
            }
        });
    };
    // Write file
    const writeFile = (fileDescriptor) => {
        _fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
                closeFile(fileDescriptor);
            } else {
                callback('Error writihg to existing file');
            }
        });
    };
    // Close file
    const closeFile = (fileDescriptor) => {
        _fs.close(fileDescriptor, (err) => {
            if (!err) {
                const parseData = _helpers.parseJsonToObject(stringData);
                callback(false, parseData);
            } else {
                callback('Error closing the file');
            }
        });
    };
    // Run update file
    openFile();
};

// Delete a file
lib.delete = function(dir, file, callback) {
    _fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file');
        }
    });
};

// Check the user token.
// Required params: tokenId
// Optional: email
// If the email is not submitted, it only checks the duration of the token
lib.verifyToken = function(tokenId, email, callback) {
    // Read token
    _fs.readFile(lib.baseDir + '/tokens' + '/' + tokenId + '.json', 'utf8', (err, file) => {
        if (!err && file) {
            const parseData = _helpers.parseJsonToObject(file);
            if (email) {
                if (parseData.email == email && parseData.expires > Date.now()) {
                    callback(false, parseData);
                } else {
                    callback(true);
                }
            } else {
                if (parseData.expires > Date.now()) {
                    callback(false, parseData);
                } else {
                    callback(true);
                }
            }
        } else {
            callback(err);
        }
    });
}
// Export module
module.exports = lib;