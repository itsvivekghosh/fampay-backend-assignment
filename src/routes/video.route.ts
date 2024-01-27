import express, { Request, Response } from "express";
import { STATUS_CODES } from "../constants/response.constants";

const videoRouter = express.Router();
const videoController = require("../controllers/video.controller");

/*
  Get data from Youtube V3 API and saving the data in Database.
*/
videoRouter.get("/", async (req: Request, res: Response) => {
  try {
    let response = await videoController.getVideoResponse(req, res);

    if (response?.status === "error") {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(response);
    } else {
      return res.status(STATUS_CODES.OK_HTTP_RESPONSE).send(response);
    }
  } catch (error: any) {
    const errorMessage = `ERROR GET /videos API, Cause: ${JSON.stringify(
      error?.message
    )}`;
    console.error(errorMessage);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      status: "error",
      message: errorMessage,
    });
  }
});

/*
  Fetching all the videos from database as per the pagination and page size.
*/
videoRouter.get("/getAllVideos", async (req: Request, res: Response) => {
  try {
    let response = await videoController.getAllVideoResponse(req, res);
    if (response?.status === "error") {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(response);
    }

    return res.status(STATUS_CODES.OK_HTTP_RESPONSE).send(response);
  } catch (error: any) {
    const errorMessage = `ERROR GET /getAllVideos API, Cause: ${JSON.stringify(
      error?.message
    )}`;
    console.error(errorMessage);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      status: "error",
      message: errorMessage,
    });
  }
});

/*
  Router to Search any video in the column Title or description. [FUZZY SEARCH such as::: 
     A video with title `How to make tea?` should match for the search query `tea how`
  ]
*/
videoRouter.get("/getByTitleOrDescription", async (req: Request, res: Response) => {
  try {
    let response =
      await videoController.getAllVideoModelGetByTitleOrDescriptionResponse(
        req,
        res
      );
    if (response?.status === "error") {
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(response);
    }

    return res.status(STATUS_CODES.OK_HTTP_RESPONSE).send(response);
  } catch (error: any) {
    const errorMessage = `ERROR GET /getByTitleOrDescription API, Cause: ${JSON.stringify(
      error?.message
    )}`;
    console.error(errorMessage);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
      status: "error",
      message: errorMessage,
    });
  }
});

module.exports = videoRouter;