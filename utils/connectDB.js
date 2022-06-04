const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to the database')
    } catch (error) {
        console.log('Could not connect to the database')
        process.exit(1);
    } 

}

module.exports = connectDB;