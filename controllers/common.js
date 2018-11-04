/*
* Commont tasks controller
*
*/

// Instantiate CommonController
const CommonController = (data, callback) => {
    // Handle route from trimmedPath or return 404
    if (CommonController[data.trimmedPath]) {
        CommonController[data.trimmedPath](data, callback);
    } else {
        callback(404);
    }

};

// Ping route handler
CommonController.ping = function (data, callback) {
    callback(200);
};

// Export CommonController module
module.exports = CommonController;