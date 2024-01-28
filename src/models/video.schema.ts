import { model, Schema } from "mongoose"

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
      required: false
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
      type: Object,
      required: true
    }
  }
);

export default model("video", VideoSchema);
