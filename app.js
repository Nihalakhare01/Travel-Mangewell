const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-Mate");
const wrapAsync = require("./utils/wrapAsync.js");
const Expresserr = require("./utils/Expresserr.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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
        // console.log(err);
        res.status(statusCode);
    res.render("error.ejs", {message});
    
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});