const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

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

const initDB = async() => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner: "667ed30557cc0f8bbd291fb0"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};

initDB();

