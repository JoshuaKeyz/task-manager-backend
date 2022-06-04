const express = require('express');
const { registerUser, loginUser, getMe, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const protect = require('../middlewares/protect.middleware');
const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/me').get(protect, getMe)
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetPassword/:resetToken').put(resetPassword)

module.exports = AuthRoutes = router;