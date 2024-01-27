require("dotenv").config();
import { VideoSchemaDTO } from "../models/video.model";
const dbConn = require("../configs/db.config");

export class VideoQueries {
  /*
    Saving/Inserting the data in the database.
  */
  public static VideoModelCreateQuery = async (data: typeof VideoSchemaDTO) => {
      // TO:DO :: LOGIC TO SAVE VIDEO MODEL
  };

  /* 
    Fetching all the videos as per the search query and responding as the paginated response.
  */
  public static getVideosByAnyKeyQueryResponse = async (
    pageNumber: number,
    pageSize: number,
    sortByOrder: string,
    sortByKey: string
  ) => {
    // TO:DO :: LOGIC TO GET VIDEOS BY KEY QUERY
  };

  /*
    Query to get all the videos from Database, where the search query lies in Description or in Title. [FUZZY SEARCH like:
       A video with title `How to make tea?` should match for the search query `tea how`.
    ]
  */
  public static VideoModelGetByTitleOrDescriptionQuery = async (
    searchString: String,
    pageNumber: number,
    pageSize: number,
    sortByOrder: string,
    sortByKey: string
  ) => {
    // TO:DO :: LOGIC TO GET VIDEOS BY TITLE OR DESCRIPTION
  }
}

module.exports = VideoQueries;