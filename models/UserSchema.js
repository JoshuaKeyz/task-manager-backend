const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ],
        unique: true
    },
    password: {
        type: String,
        minlength: [6, 'Password must be longer than 6 characters'],
        required: [true, 'Password is required'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpire: {
        type: Date
    }
});

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.methods.getJWTSignedToken = function() {
    const token = jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
    return token;
}
UserSchema.methods.matchPassword = async function(password) {
    console.log(this)
    return await bcrypt.compare(password, this.password);
}
UserSchema.methods.getResetToken = function() {
    const randomBytes = crypto.randomBytes(30).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(randomBytes).digest('hex')
    this.passwordResetToken = resetPasswordToken;
    this.passwordResetTokenExpire = Date.now() + 10 * 60 * 60 * 1000;

    return randomBytes;
}
module.exports = UserModel = mongoose.model('user', UserSchema);