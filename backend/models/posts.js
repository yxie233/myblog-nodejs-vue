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
  date: String,
  isPublish: Boolean,
  comment_num: Number    
});

var AidTrackSchema = new Schema({
  next: Number
});

var CommentSchema = new Schema({
  article_id: String,
  comment: [
    {
      "username": String,
      "email": String,
      "content": String,
      "dateTime": String,
      "comment_replies": [
        {
          "reply_username": String,
          "reply_email": String,
          "reply_to": String,
          "reply_content": String,
          "reply_dateTime": String
        }
      ]
    }
  ]  
});

module.exports = mongoose.model("Post", PostSchema);
module.exports = mongoose.model("Article", ArticleSchema);
module.exports = mongoose.model("AidTrack", AidTrackSchema); 
module.exports = mongoose.model("Comment", CommentSchema); 