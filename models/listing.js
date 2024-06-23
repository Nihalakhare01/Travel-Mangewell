const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{ 
        type: String,
        required: true,    
    },
    description : String,
    image : { 
        type: String,
        default : "https://unsplash.com/photos/green-mountain-beside-body-of-water-during-daytime-8d5BioG1Kas",
        set: (v) => 
            v === "" 
              ? "https://unsplash.com/photos/green-mountain-beside-body-of-water-during-daytime-8d5BioG1Kas" 
              : v,    
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;