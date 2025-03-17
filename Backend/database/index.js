const mongoose = require("mongoose");
const { dbConnectionString } = require('../config/index')

const dbConnect = async () => {
    try {
        mongoose.set('strictQuery',false);
        const conn = await mongoose.connect(dbConnectionString);
        console.log(`Database connected to host: ${conn.connection.host} `)
    } catch (error) {
        console.log(`Error to connect to Mongo ${error}`)
    }
}

module.exports = dbConnect;