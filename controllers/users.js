const User = require("../models/user.js");
// const passport = require("passport");


module.exports.renderSignupForm  = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signupProcess  = async (req, res) => {
    try{
            let {username, email, password} = req.body;
            const newUser = new User({email,username});
            const registeredUser = await User.register(newUser, password); 
            // console.log(registeredUser);

                req.login(registeredUser, (err) => {
                    if(err) {
                        return next(err);
                    }
                    req.flash("success", "Welcome to Wanderlust");
                    res.redirect("/listings");
                })
        }catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
        }
};

module.exports.renderLoginForm  = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginProcess  = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutProcess = (req, res, next) => {
    req.logout((err) => {
        if(err){
            next(err);
        }else{
            req.flash("success", "You are logged out!");
            res.redirect("/listings");
        }
    })
};