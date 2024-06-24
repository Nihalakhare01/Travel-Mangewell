const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-Mate");
const wrapAsync = require("./utils/wrapAsync.js");
const Expresserr = require("./utils/Expresserr.js");
const {listingSchema} = require("./schema.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/", (req, res) => {
    res.send("Hi, I am root");
});
 
// schema validation middleware
const validateListing = (req,res, next) => {
    let {error} = listingSchema.validate(req.body);
     if(error){
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new Expresserr(400, errmsg);
    }else{
        next();
    }
}

// index Route
app.get("/listings", wrapAsync( async (req,res) => {
   const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
}));

// New Route
app.get("/listings/new", wrapAsync((req,res) => {
    res.render("listings/new.ejs");
}));

// show Route
app.get("/listings/:id", wrapAsync( async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//Create Route
 app.post("/listings" , validateListing, wrapAsync( async (req, res, next) => {
    const newListing = new listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings"); 
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// update Route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) =>{
    if(!req.body.listing){
        throw new Expresserr(400, "Send Valid data for listing");
    }
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {... req.body.listing});
   res.redirect(`/listings/${id}`);
}));

// Delete Listing
app.delete("/listings/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
//   console.log(deleted);
    res.redirect("/listings");
}));

// app.get("/testListing", async (req,res) => {
//     let SampleListing = new listing({
//         title: "My New Villa",
//         description : "By the Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//     await SampleListing.save()
//     .then((res) => {
//         console.log(res);
//     }).catch((err) => {
//         console.log(err);
//     })
//     res.send("successful Listing");
// });

app.all("*", (req, res, next) => {
    next(new Expresserr (404, "Page Forbidden!"));
});
 
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    res.render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});