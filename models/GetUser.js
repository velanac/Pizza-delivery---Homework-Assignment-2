/*
* Get user model.
* Takes parameters from file and return dto
*
*/

class GetUser {
    constructor(data) {
        // Key for user file
        this.email = typeof(data.email) == 'string' && data.email.trim().length > 0 ? data.email.trim() : false;
        this.firstName = typeof(data.firstName) == 'string' && data.firstName.trim().length > 0 ? data.firstName.trim() : false;
        this.lastName = typeof(data.lastName) == 'string' && data.lastName.trim().length > 0 ? data.lastName.trim() : false;
        this.address = typeof(data.address) == 'string' && data.address.trim().length > 0 ? data.address.trim() : false;
        this.city = typeof(data.city) == 'string' && data.city.trim().length > 0 ? data.city.trim() : false;
    }
}

module.exports = { GetUser: GetUser };