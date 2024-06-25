const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserr = require("../utils/Expresserr.js");
const {listingSchema} = require("../schema.js");



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
router.get("/new", wrapAsync(async (req,res) => {
    res.render("listings/new.ejs");
}));

// show Route
router.get("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

//Create Route
router.post("/" , validateListing, wrapAsync( async (req, res) => {
    const newListing = new Listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings"); 
}));

// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) =>{
    if(!req.body.listing){
        throw new Expresserr(400, "Send Valid data for listing");
    }
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {... req.body.listing});
   res.redirect(`/listings/${id}`);
}));

// Delete Listing
router.delete("/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
//   console.log(deleted);
    res.redirect("/listings");
}));



module.exports = router;