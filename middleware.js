const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //rediirect url
        req.session.redirectUrl = req.originalUrl; 
        req.flash("error", "You must be logged in to access");
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

module.exports.isOwner = async( req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","Only owner is permitted to access");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.isReviewOwner = async( req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","Only owner is permitted to delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
}; 