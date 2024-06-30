const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// signup form route
// signup process
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signupProcess));


// login form route
// login process
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
        passport.authenticate("local", {failureRedirect: '/login', failureFlash: true }), 
        userController.loginProcess
   );

// delete
router.get("/logout", userController.logoutProcess);

module.exports = router;    