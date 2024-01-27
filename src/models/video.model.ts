export const VideoModel = {
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
  };