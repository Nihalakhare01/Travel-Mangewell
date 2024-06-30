const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserr = require("../utils/Expresserr.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewOwner, validateReview } = require("../middleware.js");

const Reviewcontroller = require("../controllers/reviews.js");


// Reviews post Route
router.post("/",isLoggedIn, validateReview, wrapAsync(Reviewcontroller.createReview));
 
 // Comment Delete Route
 router.delete("/:reviewId",isLoggedIn, isReviewOwner, wrapAsync(Reviewcontroller.deleteReview));

 module.exports = router;