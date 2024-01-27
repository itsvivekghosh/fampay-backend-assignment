require("dotenv").config();
import {VideoModel} from "../models/video.model";
import VideoSchema from "../models/video.schema";

export class VideoQueries {

  /*
    Saving/Inserting the data in the database.
  */
  public static insertVideoDataInDatabase = async (data: any[]) => {
    try {
		await VideoSchema.insertMany(data);
		return {
			status: "success",
			message: "Successfully Inserted data in DB"
		};
    } catch (err: any) {
      console.error("Error while saving data in DB, " + err?.message)
    }
  };

  /* 
    Fetching all the videos as per the search query and responding as the paginated response.
  */
  public static getVideosByAnyKeyQueryResponse = async (
    pageNumber: number = 1,
    pageSize: number = 10,
    sortByOrder: string = "desc",
    sortByKey: string = "createdAt"
  ) => {
	try {
		const numberOfRecords = await VideoSchema.countDocuments(); // count the number of records for that model
		if (Number(pageSize) * (Number(pageNumber) - 1) > numberOfRecords) {
			return { status: "error", data: "Error Pagesize or pageNumber" };
		}
		const data = await VideoSchema
			.find()
			.sort((sortByOrder.includes("desc") ? "-" : "") + sortByKey)
			.skip(Number(pageSize) * (Number(pageNumber) - 1))
			.limit(Number(pageSize));
		return {
			status: "success",
			data,
			numberOfRecords
		};
	} catch (err: any) {
		console.error(err)
	}
  };

  /*
    Query to get all the videos from Database, where the search query lies in Description or in Title. [FUZZY SEARCH like:
       A video with title `How to make tea?` should match for the search query `tea how`.
    ]
  */
  public static VideoModelGetByTitleOrDescriptionQuery = async (
    searchString: String,
    pageNumber: number = 1,
    pageSize: number = 10,
    sortByOrder: string = "desc",
    sortByKey: string = "publishTime"
  ) => {
	try {
		const numberOfRecords = await VideoSchema.countDocuments(); // count the number of records for that model
		if (Number(pageSize) * (Number(pageNumber) - 1) > numberOfRecords) {
			return { status: "error", data: "Error Pagesize or pageNumber" };
		}
		const data = await VideoSchema
			.find({$or:[
				{ title: { "$regex": searchString, "$options": "i" } }, { description: { "$regex": searchString, "$options": "i" } }
			]})
			.sort((sortByOrder.includes("desc") ? "-" : "") + sortByKey)
			.skip(Number(pageSize) * (Number(pageNumber) - 1))
			.limit(Number(pageSize));
		return {
			status: "success",
			data,
			numberOfRecords
		};
	} catch (err: any) {
		console.error(err)
	}
  }
}

module.exports = VideoQueries;