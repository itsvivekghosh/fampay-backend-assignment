import { model, Schema } from "mongoose"


const thumbnailsModel = new Schema({
  url: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  }
});

const VideoSchema: Schema = new Schema({
    title: {
      type: String,
      required: true
    },
    channelId: {
      type: String,
      required: true
    },
    channelTitle: {
      type: String,
      required: true
    },
    videoId: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    publishedAt: {
      type: Date,
      required: true
    },
    publishTime: {
      type: Date,
      required: true
    },
    thumbnails: {
      default: thumbnailsModel,
      medium: thumbnailsModel,
      high: thumbnailsModel
    }
  }
);

export default model("video", VideoSchema);