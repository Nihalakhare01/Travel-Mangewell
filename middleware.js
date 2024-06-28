module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //rediirect url
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must be logged in to create Listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};