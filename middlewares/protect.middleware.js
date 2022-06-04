const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/error-response");
const UserModel = require('./../models/UserSchema');
const asyncHandler = require("./async-handler");

const protect = asyncHandler(async (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization) {
        return next(new ErrorResponse('Not authorized to access this resource', 401));
    }
    const token = authorization.split(' ')[1]

    if(!token) {
        return next(new ErrorResponse('Not authorized to access this resource', 401));
    }
    const userId = jwt.verify(token, process.env.JWT_SECRET);
    if(!userId) {
        return next(new ErrorResponse('Not authorized to access this resource', 401));
    }
    req.user = await UserModel.findById(userId.id);
    next();
})

module.exports = protect;