const Listing = require("../models/listing.js");

module.exports.index =  async (req,res) => {
    const allListings = await Listing.find({});
         res.render("listings/index.ejs", { allListings });
 };


 module.exports.rendernewForm  = (req,res) => {
    res.render("listings/new.ejs");
};

 module.exports.showListing  = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate( { path : "reviews", populate: {path: "author"}, }).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.redirect("/listings");
    }else{
        // console.log(listing);
        res.render("listings/show.ejs", {listing});
    }
    
};


 module.exports.renderEditForm  = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing (req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing created!");
    res.redirect("/listings"); 
};

module.exports.updateListing = async (req, res) =>{
    let {id} = req.params;
        await Listing.findByIdAndUpdate(id, {... req.body.listing});
        req.flash("success","Listing Updated!");
        res.redirect(`/listings/${id}`);
    
};

module.exports.deleteListing = async (req,res) =>{
    let {id} = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  req.flash("success","Listing Deleted!");
//   console.log(deleted);
    res.redirect("/listings");
};