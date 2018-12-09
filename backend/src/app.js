const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '../../client/dist')))
var mongoose = require('mongoose');
mongoose.connect('mongodb://bilicrawlerAdmin:addData2018@ds253889.mlab.com:53889/bilibilidata', { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});
var schema = require('../models/posts'); // in order to use models
var Post = mongoose.model("Post"),
    Article = mongoose.model('Article'),
    Comment = mongoose.model('Comment');

// var http = require('http');
// var server = http.createServer(app);

/* view for single art
   view for edit art
*/
app.get('/article/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
})

app.get('/editArticle/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
})



/*
app.get('/show',  (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})*/
function format(t){
  console.log("kkkkkk&& "+ t)
  return t>9?t:("0"+t);
}

function myDate() {
  let date=new Date();
  let month = format(date.getMonth() + 1),
      day = format(date.getDate()),
      h = format(date.getHours()), 
      min = format(date.getMinutes()),
      sec = format(date.getSeconds());

  let time = date.getFullYear() + "-" + month + "-" + day + " "+h+":"+min+":"+sec;

  return time;
}
  

// Add new post
app.post('/posts', (req, res) => {
  var db = req.db;
  var title = req.body.title;
  var description = req.body.description;
  var new_post = new Post({
    title: title,
    description: description
  })

  new_post.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!'
    })
  })
})

// Fetch all posts
app.get('/posts', (req, res) => {
  Post.find({}, 'title description', function (error, posts) {
    if (error) { console.error(error); }
    res.send({
      posts: posts
    })
  }).sort({_id:-1})
})

// Fetch single post
app.get('/post/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, 'title description', function (error, post) {
    if (error) { console.error(error); }
    res.send(post)
  })
})

// Update a post
app.put('/posts/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.body.id, 'title description', function (error, post) { //#params
    if (error) { console.error(error); }

    post.title = req.body.title
    post.description = req.body.description
    post.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete a post
app.delete('/posts/:id', (req, res) => {
  var db = req.db;
  Post.remove({
    _id: req.params.id
  }, function(err, post){
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})

// Add new article
app.post('/articles-api', (req, res) => {
  //var db = req.db;
  var title = req.body.title;
  var content = req.body.content;
  var date = myDate();
  var tags=req.body.tags.split("@");
  var new_post = new Article({
    aid: 8, //todo
    title: title,
    content: content,
    tags: tags,
    date: date,
    isPublish: true,
    comment_n: 0  
  })

  new_post.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!'
    })
  })
})

// Fetch all art
app.get('/articles-api', (req, res) => {
  Article.find({}, function (error, posts) {
    if (error) { console.error(error); }
    res.send({
      posts: posts
    })
  }).sort({_id:-1})
})

// Fetch single art
app.get('/articles-api/:id', (req, res) => {
  var db = req.db;
  Article.findById(req.params.id, function (error, post) {
    if (error) { console.error(error); }
    res.send(post)
  })
})

// Delete a article
app.delete('/articles-api/:id', (req, res) => {
  Article.remove({
    _id: req.params.id
  }, function(err, post){
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})

// Update a art
app.put('/articles-api/:id', (req, res) => {
  var db = req.db;
  Article.findById(req.body.id, function (error, post) { //#params
    if (error) { console.error(error); }

    post.title = req.body.title
    post.content = req.body.content
    try{ post.tags = req.body.tags.split("@")}
    catch(e){post.tags =  req.body.tags}
    
    post.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Add a comment
app.post('/comment-api', (req, res) => {

  Comment.find({article_id: req.body.article_id}, function (error, cmt) {
    if (error) { console.error(error); return; }
    var new_cmt = {
        username: req.body.username,
        email: req.body.email,
        content: req.body.content,
        dateTime: myDate(),
        comment_replies: null
    }
    
    if (cmt.length > 0){
      cmt[0].comment.push(new_cmt)     
    }else{
      cmt[0] = new Comment({
        article_id: req.body.article_id,
        comment: [new_cmt]
      })

    }
    cmt[0].save(function (error) {
        if (error) {
          console.log(error)
        }
        res.send({
          success: true,
          message: 'Added a comment!'
        })
    })

  })

})

// Fetch cmts
app.get('/comment-api/:id', (req, res) => {
  Comment.find({article_id: req.params.id}, function (error, cmt) {
    if (error) { console.error(error); }
    
    if (cmt.length > 0){
      res.send(cmt[0])
    }
    else{
      res.send({comment: []})
    }
  })
})

// Update a art
app.put('/comment-api/:id', (req, res) => {
  Comment.find({article_id: req.params.id}, function (error, cmt) {
    if (error) { console.error(error); }

    var new_cmt = {
      reply_username: req.body.reply_username,
      reply_email: req.body.reply_email,
      reply_to: req.body.reply_to,
      reply_content: req.body.reply_content,     
      reply_dateTime: myDate()
    }
     
    var comments = cmt[0].comment;
    for(let i=0;i<comments.length; i++ ){
     console.log( JSON.stringify(comments[i]))
      if(comments[i]._id == req.body.parentId){
        console.log( req.body.parentId+"##########3")
        if(comments[i].comment_replies === null){
          comments[i].comment_replies = [new_cmt]
        }
        else
          comments[i].comment_replies.push(new_cmt);
        break;
      }
    }
    cmt[0].save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true,
        message: 'Added a reply!'
      })
    }) 
  })
})

app.listen(process.env.PORT || 8082)