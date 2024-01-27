const mongoose = require("mongoose");
const mongooseFuzzySearching = require("mongoose-fuzzy-searching");

export const VideoSchemaDTO = new mongoose.Schema({
  title: String,
  channelId: String,
  channelTitle: String,
  videoId: String,
  description: String,
  publishedAt: Date,
  publishTime: Date,
  thumbnails: {
    default: {
      url: String,
      width: Number,
      height: Number,
    },
    medium: {
      url: String,
      width: Number,
      height: Number,
    },
    high: {
      url: String,
      width: Number,
      height: Number,
    },
  },
});

VideoSchemaDTO.plugin(mongooseFuzzySearching, {
  fields: ["title", "description"],
});

module.exports = mongoose.model("Video", VideoSchemaDTO);