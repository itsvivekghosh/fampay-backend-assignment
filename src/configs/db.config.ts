require("dotenv").config();
const mongoose = require("mongoose");


// GET Mongo ENV Values
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_AUTH_DB = process.env.MONGO_AUTH_DB;
const MONGODB_URL = process.env.MONGODB_URL;

/* 
 Creating the MongoDB Database connection
*/
mongoose.Promise = global.Promise;
const MONGO_URI = `${MONGODB_URL}${MONGO_PORT}/${MONGO_AUTH_DB}`;

// Connecting to Mongo Database
mongoose.connect(
  MONGO_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,  
    useFindAndModify: true 
  }
);

const dbConn = mongoose.connection;
dbConn.on('error', function (err: any){
  console.error('Error occured while connecting Mongo Server: ' + err);
});
dbConn.once('connected', function(){
  console.log(`Connected to the Mongo Server at PORT: ${MONGO_PORT}`);
});

module.exports = dbConn;