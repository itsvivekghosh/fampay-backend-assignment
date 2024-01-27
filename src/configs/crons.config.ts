require("dotenv").config();
const cron = require("node-cron");
const videoController = require("../controllers/video.controller");

const CRON_SCHEDULE_TIME = process.env.CRON_SCHEDULE_TIME;

/*
  Created a CRON Job for fetching the videos ever 10 seconds and saving in the database
*/
const fetchVideosAndSaveInDatabase = () => {
  cron.schedule(`*/${CRON_SCHEDULE_TIME} * * * * *`, async function () {
    console.log(`Executing Cron in every ${CRON_SCHEDULE_TIME} seconds`);
    let response = await videoController.getVideoResponse();
    console.log(`Appended ${response?.data?.length} results in Mongo DB!`);
  });
};

module.exports = fetchVideosAndSaveInDatabase;