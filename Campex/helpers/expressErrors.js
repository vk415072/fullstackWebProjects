// 1. creating class to handel errors
class ExpressErrors extends Error {
    constructor(message, statusCode) {
        supper();
        this.message = message;
        this.statusCode = statusCode;
    }
}

// 2. exporting data
module.exports = ExpressErrors;