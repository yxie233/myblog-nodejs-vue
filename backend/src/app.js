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
mongoose.connect('mongodb://bilicrawlerAdmin:addData2018@ds253889.mlab.com:53889/bilibilidata');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});
var schema = require('../models/posts');
var Post = mongoose.model("Post"),
    Article = mongoose.model('Article')

/*
app.get('/show',  (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})*/

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
app.post('/articles', (req, res) => {
  //var db = req.db;
  var title = req.body.title;
  var content = req.body.content;
  var date = Date();
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
app.get('/articles', (req, res) => {
  Article.find({}, function (error, posts) {
    if (error) { console.error(error); }
    res.send({
      posts: posts
    })
  }).sort({_id:-1})
})

// Fetch single art
app.get('/articles/:id', (req, res) => {
  var db = req.db;
  Article.findById(req.params.id, function (error, post) {
    if (error) { console.error(error); }
    res.send(post)
  })
})

// Delete a article
app.delete('/articles/:id', (req, res) => {
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
app.put('/articles/:id', (req, res) => {
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

app.listen(process.env.PORT || 8081)