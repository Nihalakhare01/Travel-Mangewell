const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserr = require("../utils/Expresserr.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewOwner } = require("../middleware.js");

//  Review schema validation middleware
const validateReview = (req,res, next) => {
    let {error} = reviewSchema.validate(req.body);
     if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new Expresserr(400, errmsg);
    }else{
        next();
    }
};

// Reviews
// post Route
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
    req.flash("success","Review posted!");
     res.redirect(`/listings/${listing._id}`);
 }));
 
 // Comment Delete Route
 router.delete("/:reviewId",isLoggedIn, isReviewOwner, wrapAsync(async (req,res) => {
         let {id, reviewId } = req.params;
 
         await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});
         await Review.findByIdAndDelete(reviewId);
         req.flash("success","Review Deleted!");
         res.redirect(`/listings/${id}`);
     })
 );

 module.exports = router;