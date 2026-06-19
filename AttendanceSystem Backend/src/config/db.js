const mongoose = require("mongoose");

const DB_URL = process.env.DB_URI

const DBconnect = async () => {
    try {

        await mongoose.connect(DB_URL)
        console.log("MongoDB Connected: Done ✅")
        
    } catch (error) {
        
    }
    
}

module.exports = DBconnect;