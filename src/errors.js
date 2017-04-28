class GolbError extends Error {
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
        this.message = message;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message
        };
    }
}

export let SyntaxError = class GolbSyntaxError extends GolbError {
    constructor(message) {
        super(message);
    }
};

export let AuthorizationError = class GolbAuthorizationError extends GolbError {
    constructor(message) {
        super(message);
    }
};

export let AuthenticationError = class GolbAuthenticationError extends GolbError {
    constructor(message) {
        super(message);
    }
};