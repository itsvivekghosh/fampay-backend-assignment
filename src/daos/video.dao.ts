require("dotenv").config();
import axios, { AxiosError } from "axios";
import { redisClient } from "../configs/redis.config";

const VideoQueries = require("../queries/video.query");

class VideoHelper {
  
  static apiKey = process.env.YOUTUBE_API_KEY;
  static apiUrl = process.env.YOUTUBE_API_URL;
  static maxResults = Number(process.env.MAX_FETCH_RESULTS);

  /*
    Call the youtube API and getting the response as per documented. 
  */
  public static async getVideoListFromYoutubeV3API(
    searchQuery: string, // SEARCH Query
    pageSize: number = 10 // Search Page Size
  ) {
    try {
      if (pageSize && pageSize > Number(process.env.MAX_FETCH_RESULTS)) {
        this.maxResults = Number(pageSize);
      }

      let response: any;
      if (this.apiKey) {
        // Handled multiple YOUTUBE_API_KEYS if the key is expired
        this.apiKey = this.apiKey.replace(/\s/g, "");

        for (const apiKey of this.apiKey?.split(",")) {
          const YOUTUBE_FETCH_API_URL = `${this.apiUrl}/search?key=${apiKey}&type=video&part=snippet&maxResults=${this.maxResults}&q=${searchQuery}`;

          response = await axios(YOUTUBE_FETCH_API_URL).catch(
            (reason: AxiosError<any>) => {
              if (reason.response!.status === 400) {
                // Handle 400
                const errorMessage = `Getting Error while using the API_KEY: ${apiKey}, STATUS: ${
                  reason.response!.status
                }, ERROR: ${reason?.message}`;
                console.error(errorMessage);
                return {
                  status: "error",
                  message: errorMessage,
                };
              }
            }
          );
          if (response?.status === 200) {
            break;
          }
          if (!response?.data && !response?.data?.items) {
            // This block handles that if the data items are empty then, search with next apiKey
            continue;
          }
        }
      } else {
        const errorMessage = `No API Keys, Please provide a valid 'YOUTUBE_API_KEY'`;
        console.error(errorMessage);
        return {
          status: "error",
          message: errorMessage,
        };
      }

      let result: any[] = [];
      response?.data?.items?.map((item: any) => {
        result.push({
          title: item?.snippet?.title,
          channelId: item?.snippet?.channelId,
          channelTitle: item?.snippet?.channelTitle,
          videoId: item?.id?.videoId,
          description: item?.snippet?.description,
          publishedAt: item?.snippet?.publishedAt,
          publishTime: item?.snippet?.publishTime,
          thumbnails: item?.snippet?.thumbnails,
        });
      });

      return {
        status: "success",
        data: result,
      };
    } catch (err: any) {
      const errorMessage = `Error while fetching youtube video details: ${JSON.stringify(
        err?.message
      )}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }
  }

  /*
    Sort the response as per publishTime key and sortOrder.
  */
  public static async getSortedResponseforYoutubeV3APIResponse(
    response: any,
    sortByOrder: string
  ) {
    try {
      await response?.data?.sort((a: any, b: any) => {
        return sortByOrder === "desc"
          ? Date.parse(b?.["publishTime"]) - Date.parse(a?.["publishTime"])
          : Date.parse(a?.["publishTime"]) - Date.parse(b?.["publishTime"]);
      });

      return response;
    } catch (err: any) {
      const errorMessage = `Error while sorting as per publish time details: ${JSON.stringify(
        err?.message
      )}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }
  }

  /*
    Appending the data in the database from the response.
  */
  public static async setYoutubeVideoResponseInDatabase(response: any) {
    try {
      let listData: any[] = [];

      response?.data?.map(async (data: any) => {
        let object = {
          title: this.removeSpecials(data?.["title"]),
          channelId: data?.["channelId"],
          channelTitle: data?.["channelTitle"],
          videoId: data?.["videoId"],
          description: data?.["description"],
          publishedAt: data?.["publishedAt"],
          thumbnails: JSON.stringify(data?.["thumbnails"]),
          publishTime: data?.["publishTime"],
        };
        listData.push(object);
      });

      let resp = await VideoHelper.saveDataInDatabase(listData);

      if (resp?.status === "success")
        return {
          status: "success",
          message: "Data saved in DB!",
        };
      else {
        return {
          status: "error",
          message: "Error while saving the data in DB!",
        };
      }
    } catch (err: any) {
      const errorMessage = `Error while saving the data in DB!, Cause: ${JSON.stringify(
        err?.message
      )}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }
  }

  /* 
   Helper function to save the Data in the Database.
  */
  static async saveDataInDatabase(VideoObjectList: any[]) {
    try {
      const result = await VideoQueries.insertVideoDataInDatabase(VideoObjectList);
      if (result?.status !== "success") {
        return {
          status: "error",
          message: result?.message,
        };
      }

      return {
        status: "success",
        message: "Data saved in database!",
      };
    } catch (error: any) {
      const errorMessage = `ERROR while Saving the schema, Cause: ${JSON.stringify(
        error?.message
      )}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }
  }

  public static paginateArrayByPageSizeAndNumber = (
    response: any,
    page_size: number = 10,
    page_number: number = 1
  ) => {
    response.data = response?.data?.slice(
      (page_number - 1) * page_size,
      page_number * page_size
    );

    return response;
  };

  /*
    Removing special Characters from the given string.
  */
  static removeSpecials(str: any) {
    try {
      let lower = str.toLowerCase();
      let upper = str.toUpperCase();

      let res = "" as String,
        position = 0,
        length = lower.length,
        tempString;
      for (; position < length; ++position) {
        if (
          lower[position] !== upper[position] ||
          lower[position].trim() === ""
        ) {
          tempString = str[position];
          if (tempString !== undefined) {
            res += tempString;
          }
        }
      }

      return new String(res);
    } catch (error: any) {
      const errorMessage = `Error while removing special characters: ${JSON.stringify(
        error?.message
      )}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }
  }

  /*
    Fetching all the videos as per the SortKey and SortOrder.
  */
  public static getAllVideosByAnyKeyInSortingOrder = async (
    pageNumber: number = 1,
    sortByOrder: string = "desc",
    sortByKey: string = "publishTime",
    pageSize: number = 10
  ) => {
    try {
      let response = await VideoQueries.getVideosByAnyKeyQueryResponse(
        pageNumber,
        pageSize,
        sortByOrder,
        sortByKey
      );

      if (response?.status !== "error") {
        response?.data?.map((data: any) => {
          data.thumbnails = JSON.parse(data?.thumbnails);
          // delete data?.created_at;
        });

        return {
          status: "success",
          data: response?.data,
        };
      } else {
        return response;
      }
    } catch (error: any) {
      const errorMessage = `ERROR while getting the response from YT API, Cause: ${JSON.stringify(
        error?.message
      )}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }
  };

  /*
    Fetching all the videos from Database as per Search query in Title and Description columns.
  */
  public static getAllVideosByTitleOrDescription = async (
    searchString: String,
    pageNumber: number = 1,
    pageSize: number = 10,
    sortByOrder: string,
    sortByKey: string
  ) => {
    try {
      
      let response: any = {};
      if (searchString) {
        const cachedResult = await redisClient.get(searchString.toLowerCase());
        if (cachedResult) {
          try {
            response["data"] = JSON.parse(cachedResult);
          } catch (err: any) {
            console.error(err)
            return {
              status: "error",
              data: "Can't Parse JSON Body, Cause: " + err?.message,
            };
          }
        }
      }
      else {
        response = await VideoQueries.VideoModelGetByTitleOrDescriptionQuery(
          searchString,
          pageNumber,
          pageSize,
          sortByOrder,
          sortByKey
        );
        response?.data?.map((data: any) => {
          data.thumbnails = JSON.parse(data?.thumbnails);
        });
      };

      if (!response?.data) {
        return {
          status: "success",
          data: [],
        };
      }

      return {
        status: "success",
        data: response?.data,
      };
    } catch (error: any) {
      const errorMessage = `ERROR while getting the response from DB, Cause: ${JSON.stringify(
        error?.message
      )}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }
  };
}

module.exports = VideoHelper;