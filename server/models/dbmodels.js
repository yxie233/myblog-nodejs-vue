var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var ArticleSchema = new Schema({
  title: String,
  content: String,
  tags: [String],
  date: String,
  isPublish: Boolean,
  page_view: Number,
  comment_num: Number
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

var TagsSchema = new Schema({
  tagname: {
    type: String,
    unique: true,
    required: 'Kindly enter the tag'
  },
  articles_id: [String]
});

var VisitorSchema = new Schema({
  client_ip: {
    type: String,
    unique: true
  },
  agent: String,
  date: String
});

var OtherPageSchema = new Schema({
  pageName: String,
  content: String,
  date: String,
  page_view: Number
});

module.exports = mongoose.model("Article", ArticleSchema);
module.exports = mongoose.model("AidTrack", AidTrackSchema); 
module.exports = mongoose.model("Comment", CommentSchema); 
module.exports = mongoose.model("Admin", AdminSchema); 
module.exports = mongoose.model("Tags", TagsSchema); 
module.exports = mongoose.model("Visitor", VisitorSchema); 
module.exports = mongoose.model("OtherPage", OtherPageSchema); 
