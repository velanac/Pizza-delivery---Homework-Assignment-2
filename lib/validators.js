/*
 * Validators user input
 *
 */

const validators = {};

validators.string = (stringData, length) => {
    if (length) {
        stringData = typeof(stringData) == 'string' && stringData.length === length ? stringData.trim() : false;
    } else {
        stringData = typeof(stringData) == 'string' ? stringData.trim() : false;
    }
    return stringData;
};

validators.boolean = (bool) => {
    bool = typeof(bool) == 'boolean' ? true : false;
    return bool;
};

module.exports = validators;