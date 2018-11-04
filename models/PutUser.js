/*
* Model for users put request.
* Takes parameters from payload and perform validations
* Perform validation
* Update user data
*/

class PutUser {
    constructor(payload) {
        this.firstName = typeof(payload.firstName) == 'string' && payload.firstName.trim().length > 0 ? payload.firstName.trim() : false;
        this.lastName = typeof(payload.lastName) == 'string' && payload.lastName.trim().length > 0 ? payload.lastName.trim() : false;
        this.address = typeof(payload.address) == 'string' && payload.address.trim().length > 0 ? payload.address.trim() : false;
        this.city = typeof(payload.city) == 'string' && payload.city.trim().length > 0 ? payload.city.trim() : false;
    }

    get isValid() {
        return this.firstName || this.lastName || this.address || this.city ? true : false;
    }

    update(userData) {
        if(this.firstName) {
            userData.firstName = this.firstName;
        }

        if(this.lastName) {
            userData.lastName = this.lastName;
        }

        if(this.address) {
            userData.address = this.address;
        }

        if(this.city) {
            userData.city = this.city;
        }

        return userData;
    }
}

module.exports = { PutUser: PutUser };