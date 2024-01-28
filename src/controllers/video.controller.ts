require("dotenv").config();
import { Request, Response } from "express";
import { redisClient } from "../configs/redis.config";

const videoHelper = require("../daos/video.dao");

class VideoController {
  // checking the sortOrder query params values
  static checkTheSortOrderValueMatches(value: string) {
    if (["asc", "desc"].includes(value)) {
      return true;
    }
    return false;
  }

  // checking the sortKeys query params values
  static checkTheSortKeysValueMatches(value: string) {
    if (["id", "publishedAt", "publishTime", "created_at"].includes(value)) {
      return true;
    }
    return false;
  }

  // Getting the Video Details from the Youtube API.
  public static async getVideoResponse(request: Request, _: Response) {
    const searchQuery = request?.query?.q || process.env.DEFAULT_SEARCH_VALUE;
    const sortByOrder = request?.query?.sortByOrder || "desc";
    const pageNumber = request?.query?.pageNumber || 1;
    const pageSize =
      request?.query?.pageSize ? Number(request?.query?.pageSize) : Number(process.env.DEFAULT_PAGE_SIZE);

    if (!this.checkTheSortOrderValueMatches(String(sortByOrder))) {
      const errorMessage = `Wrong key for SORT_ORDER used as ${sortByOrder}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }

    // Getting the Video List from youtube Youtube API.
    let resp = await videoHelper.getVideoListFromYoutubeV3API(
      searchQuery,
      pageSize
    );

    if (resp?.status === 'error') {
      return resp;
    }

    // Paginate the Response by Page Size and Page Number
    resp = videoHelper.paginateArrayByPageSizeAndNumber(
      resp,
      pageSize,
      pageNumber
    );

    // Getting the Sorted Response
    resp = await videoHelper.getSortedResponseforYoutubeV3APIResponse(
      resp,
      sortByOrder
    );

    // Appending the response in Database
    await videoHelper.setYoutubeVideoResponseInDatabase(resp);

    // Caching response data to REDIS
    await redisClient.set(searchQuery, JSON.stringify(resp?.data));

    if (resp?.status !== "success") {
      return {
        status: "success",
        data: resp,
      };
    } else {
      return resp;
    }
  }

  /*
    Getting the Sorted response from Database as per the sortKey and Sort Order.
  */
  public static async getAllVideoResponse(request?: Request, _?: Response) {
    const sortByOrder = request?.query?.sortByOrder || "desc";
    const pageNumber = request?.query?.pageNumber || 1;
    const sortByKey = request?.query?.sortByKey || "publishTime";
    const pageSize =
      request?.query?.pageSize ? Number(request?.query?.pageSize) : Number(process.env.DEFAULT_PAGE_SIZE);

    if (!this.checkTheSortOrderValueMatches(String(sortByOrder))) {
      const errorMessage = `wrong key for SORT_ORDER used as ${sortByOrder}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }

    if (!this.checkTheSortKeysValueMatches(String(sortByKey))) {
      const errorMessage = `wrong key SORT_KEY used as ${sortByKey}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }

    // Getting all videos by search key in any order as pe the page size
    let resp = await videoHelper.getAllVideosByAnyKeyInSortingOrder(
      pageNumber,
      sortByOrder,
      sortByKey,
      pageSize
    );

    return resp;
  }

  /*
    Getting all the Videos by Searched Query from title or description columns
  */
  public static async getAllVideoModelGetByTitleOrDescriptionResponse(
    request: Request,
    _: Response
  ) {
    const pageNumber = request?.query?.pageNumber || 1;
    const pageSize = request?.query?.pageSize || 10;
    const searchQuery = request?.query?.searchQuery;
    const sortByOrder = request?.query?.sortByOrder || "desc";
    const sortByKey = request?.query?.sortByKey || "publishTime";

    if (!searchQuery) {
      return {
        status: "error",
        message: "Invalid Query",
      };
    }

    if (!this.checkTheSortOrderValueMatches(String(sortByOrder))) {
      const errorMessage = `wrong key for SORT_ORDER used as ${sortByOrder}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }

    if (!this.checkTheSortKeysValueMatches(String(sortByKey))) {
      const errorMessage = `wrong key for SORT_KEY used as ${sortByKey}`;
      console.error(errorMessage);
      return {
        status: "error",
        message: errorMessage,
      };
    }

    let resp = await videoHelper.getAllVideosByTitleOrDescription(
      searchQuery,
      pageNumber,
      pageSize,
      sortByOrder,
      sortByKey
    );

    return resp;
  }
}

module.exports = VideoController;