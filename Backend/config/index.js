const dotenv = require('dotenv').config();


const PORT = process.env.PORT; 
const dbConnectionString = process.env.dbConnectionString; 
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH; 


module.exports = {
    PORT,
    dbConnectionString,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    BACKEND_SERVER_PATH
}