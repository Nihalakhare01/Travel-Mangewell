const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Expresserr = require("../utils/Expresserr.js");
const {listingSchema} = require("../schema.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner, validateListing } = require("../middleware.js");
const multer = require("multer");
const{ storage } = require("../cloudconfig.js");
const upload = multer({ storage });

const ListingController = require("../controllers/listings.js");


// index Route
//Create Route

router
    .route("/")
    .get(wrapAsync( ListingController.index ))
    .post(isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(ListingController.createListing));
    

// New Route
router.get("/new",isLoggedIn, ListingController.rendernewForm);


// show Route
// update Route
// Delete Listing
 router
    .route("/:id")  
    .get(isLoggedIn, wrapAsync(ListingController.showListing)) 
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(ListingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(ListingController.deleteListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner ,wrapAsync(ListingController.renderEditForm));

module.exports = router;