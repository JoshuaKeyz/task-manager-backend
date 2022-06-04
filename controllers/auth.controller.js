const asyncHandler = require("../middlewares/async-handler");
const UserModel = require("../models/UserSchema");
const ErrorResponse = require('../utils/error-response');
const sendEmail = require("../utils/send-email");
const crypto = require('crypto');

// Register User
exports.registerUser = asyncHandler(async (req, res, next) => {
    const {
        firstName, lastName,
        email, password
    } = req.body;
    const user = await UserModel.create({
        firstName, lastName, email, password
    })
    res.status(200).json({
        token: user.getJWTSignedToken()
    })
})

// Login User
exports.loginUser = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({email}).select('+password');
    if(!user) {
        return next(new ErrorResponse('The email/password entered is not correct', 400));
    }
    
    // If User exists check if the password matches
    const isMatched = await user.matchPassword(password);
    if(!isMatched) {
        console.log(isMatched)
        return next(new ErrorResponse('The email/password entered is not correct', 400));
    }

    // Everthing is okay, so send the token to the user
    res.status(200).json({
        token: user.getJWTSignedToken()
    })
})

// Get the current user
exports.getMe = asyncHandler(async(req, res, next) => {
    res.status(200).json({
        user: req.user
    })
})

// Forgot Password Request
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // Get the email
    const { email } = req.body;
    
    // Check if the email is found in the database
    const user = await UserModel.findOne({email});
    if(!user) {
        return next(new ErrorResponse('Your email was registered in the database'));
    }
    const resetToken = await user.getResetToken();
    await user.save();

    const url = `${process.env.HOST_ADDRESS}/api/v1/auth/resetPassword/${resetToken}`;

    const message = `You are receiving this email because you or someone requested to reset your password. Please
        make a put request to ${url}
    `;

    // Send the email
    const options = {
        to: user.email,
        subject: 'Password Reset Request',
        message,
    }
    try {
        await sendEmail(options);
        res.status(200).json({
            message: 'Email Sent'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;
        await user.save();
        next(new ErrorResponse('Could not send the email: ' + err.message, 500 ))
    }
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const passwordResetToken = req.params.resetToken;
    const hashedPasswordResetToken = crypto.createHash('sha256').update(passwordResetToken).digest('hex');

    const {
        newPassword
    } = req.body;
    const user = await UserModel.findOne({passwordResetToken: hashedPasswordResetToken, passwordResetTokenExpire: {$gt: Date.now()} });
    if(!user) {
        return next(new ErrorResponse('Invalid Reset Token', 400))
    }

    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.password = newPassword;

    await user.save();

    res.status(200).json({
        token: user.getJWTSignedToken()
    })
});