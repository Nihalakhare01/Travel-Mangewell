const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-Mate");

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

// index Route
app.get("/listings", async (req,res) => {
   const allListings = await Listing.find({});
        res.render("index.ejs", { allListings });
});

// New Route
app.get("/listings/new", (req,res) => {
    res.render("new.ejs");
});

// show Route
app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("show.ejs", {listing});
});

//Create Route
app.post("/listings" , async (req,res) => {
    const newListing = new listing (req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", {listing});
});

// update Route
app.put("/listings/:id", async (req, res) =>{
    let {id} = req.params;
   await Listing.findByIdAndUpdate(id, {... req.body.listing});
   res.redirect(`/listings/${id}`);
});

// Delete Listing
app.delete("/listings/:id", async (req,res) =>{
    let {id} = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
//   console.log(deleted);
    res.redirect("/listings");
})

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

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

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});