if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const Expresserr = require("./utils/Expresserr.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// Router or restructuring
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

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


// app.get("/", (req, res) => {
//     // res.send("Hi, I am root");
//     res.redirect("/login");
// });


const sessionOptions = {
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxage: 7*24*60*60*1000, 
        httpOnly: true,
    },
};

// Session and flash
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });
    
//     let registeredUser =  await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


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