const router = require('express').Router();
const { authenticate } = require('passport');
const passport = require('passport');
const { SignUp, Login, ChangePassword,OtpVerification, ResetPassword, ForgotPassword, Logout, CheckGAuth, DelGAuth } = require('../controllers/AuthController');
const { Authenticate } = require("../controllers/AuthToken")




router.post('/signup', SignUp);
router.post('/login', passport.authenticate('local'), Login);
router.post("/changepassword", ChangePassword);
router.post("/authenticate", Authenticate)
router.post("/logout", Logout)
router.post("/forgotpassword", ForgotPassword)
router.post("/otpverify", OtpVerification)
router.post("/resetpassword", ResetPassword)
router.post("/authenticategoogle/:id",CheckGAuth)
router.post("/deletegauth/:id",DelGAuth)


module.exports = router;


