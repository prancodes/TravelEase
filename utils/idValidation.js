const mongoose = require("mongoose");
const CustomError = require("./CustomError");

function idValidation(id) {
    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        // Throw an error if the id format is invalid
        throw new CustomError(400, "Invalid Id format");
    }
}

module.exports = { idValidation };