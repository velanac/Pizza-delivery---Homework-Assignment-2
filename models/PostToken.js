/*
* Model for users singin.
* Takes parameters from payload and perform validations
*
*/

class PostToken {
    constructor(payload, _validators) {
        // Key for user file
        this.email = _validators.string(payload.email);
        this.password = _validators.string(payload.password);
    }

    get isValid() {
        return this.email && this.password ? true : false;
    }
}

module.exports = { PostToken: PostToken };