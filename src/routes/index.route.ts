import express from "express";

const indexRouter = express.Router();

// Index Router
indexRouter.get("/", async (req: any, res: any) => {
  try {
    res.status(200).send({ status: "success", message: "Index is called" });
  } catch (error: any) {}
});

module.exports = indexRouter;