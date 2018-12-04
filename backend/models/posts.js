var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  description: String
});

var ArticleSchema = new Schema({
  aid: Number,
  title: String,
  content: String,
  tags: [String],
  date: Date,
  isPublish: Boolean,
  comment_n: Number    
});

var AidTrackSchema = new Schema({
  next: Number
});

module.exports = mongoose.model("Post", PostSchema);
module.exports = mongoose.model("Article", ArticleSchema);
module.exports = mongoose.model("AidTrack", AidTrackSchema); 