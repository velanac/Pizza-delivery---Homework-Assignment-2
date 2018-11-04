/*
* Model for users registration.
* Takes parameters from payload and perform validations
*
*/

class PostUser {
    constructor(payload, _validators) {
        // Key for user file
        this.email = _validators.string(payload.email);
        this.firstName = _validators.string(payload.firstName);
        this.lastName = _validators.string(payload.lastName);
        this.password = _validators.string(payload.password);
        this.address = _validators.string(payload.address);
        this.city = _validators.string(payload.city);
        this.hasedPassword = false;
    }

    get isValid() {
        return this.firstName && this.lastName && this.email && this.address && this.city && this.password ? true : false;
    }
}

module.exports = { PostUser: PostUser };