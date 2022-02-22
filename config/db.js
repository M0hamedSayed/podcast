const mongoose = require('mongoose');
async function connectToDb() {
    try {
        const connection = await mongoose.connect("mongodb://localhost:27017/Podcast");
        console.log(" DB connected ....")
    } catch (error) {
        console.log(" DB Problem")
    }
}

module.exports = connectToDb;