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
  page_view: Number 
});

var AidTrackSchema = new Schema({
  next: Number
});

var CommentSchema = new Schema({
  article_id: String,
  comment_num: Number,
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

var AdminSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: 'Kindly enter the username'
  },
  password: {
    type: String,
    required: 'Kindly enter the password'
  }
});

module.exports = mongoose.model("Post", PostSchema);
module.exports = mongoose.model("Article", ArticleSchema);
module.exports = mongoose.model("AidTrack", AidTrackSchema); 
module.exports = mongoose.model("Comment", CommentSchema); 
module.exports = mongoose.model("Admin", AdminSchema); 