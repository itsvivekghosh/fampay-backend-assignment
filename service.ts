require("dotenv").config();
require("./src/configs/db.config"); // Initialize Mongo DB

import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

const cors = require('cors');
const cookieParser = require("cookie-parser");
const fetchVideosAndSaveInDatabase = require("./src/configs/crons.config");

// Importing the http module
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const HTTP_PORT = process.env.HTTP_PORT;


// Index Router
app.use(
  "/",
  async (_: Request, res: Response, next: NextFunction) => {
    next();
  },
  require("./src/routes/index.route")
);

// Video Router
app.use(
  "/video",
  async (_: Request, res: Response, next: NextFunction) => {
    next();
  },
  require("./src/routes/video.route")
);

// Server listening on HTTP_PORT || 3000
app.listen(HTTP_PORT, () => {
  console.log(`Server is Running on PORT: ${HTTP_PORT}.`);
});

// CRON JOB to fetch Videos from Youtube V3 API and Save in the Database
fetchVideosAndSaveInDatabase();

module.exports = app;