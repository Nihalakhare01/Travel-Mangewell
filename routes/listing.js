const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserr = require("../utils/Expresserr.js");
const {listingSchema} = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");



//  listings schema validation middleware
const validateListing = (req,res, next) => {
    let {error} = listingSchema.validate(req.body);
     if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new Expresserr(400, errmsg);
    }else{
        next();
    }
};

// index Route
router.get("/", wrapAsync(async (req,res) => {
   const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
}));

// New Route
router.get("/new",isLoggedIn, (req,res) => {
    res.render("listings/new.ejs");
});

// show Route
router.get("/:id", isLoggedIn, wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate( { path : "reviews", populate: {path: "author"}, }).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }else{
        // console.log(listing);
        res.render("listings/show.ejs", {listing});
    }
    
}));

//Create Route
router.post("/" ,isLoggedIn, validateListing, wrapAsync( async (req, res) => {
    const newListing = new Listing (req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing created!");
    res.redirect("/listings"); 
}));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner ,wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// update Route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) =>{
    let {id} = req.params;
        await Listing.findByIdAndUpdate(id, {... req.body.listing});
        req.flash("success","Listing Updated!");
        res.redirect(`/listings/${id}`);
    
}));

// Delete Listing
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req,res) =>{
    let {id} = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
//   console.log(deleted);
    res.redirect("/listings");
}));

module.exports = router;