const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const cookieSession = require('cookie-session')


const app = express()
app.use(morgan('combined'))
// var favicon = require('serve-favicon');
// app.use(favicon( path.join(__dirname, '../../client/static/favicon.ico')));
app.use('/favicon.ico', express.static(path.join(__dirname, '../../client/static/favicon.ico')));
// app.use(bodyParser.json())
app.use(bodyParser.json({limit: '10mb'})); // set limit data size of request
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cors())


const viewsRoot = path.join(__dirname, '../../client/dist');
app.use(express.static(viewsRoot))

app.use(cookieSession({
  name: 'mysession',
  keys: ['myrandomkey'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours 
}))

var mongoose = require('mongoose');
mongoose.connect('mongodb://testonly:test123@ds253889.mlab.com:53889/bilibilidata', { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("db Connection Succeeded");
});
var schema = require('../models/dbmodels'); // in order to use models
var Article = mongoose.model('Article'),
    Comment = mongoose.model('Comment'),
    Admin = mongoose.model('Admin'),
    Tags = mongoose.model('Tags'),
    Visitor = mongoose.model('Visitor'),
    OtherPage = mongoose.model('OtherPage');

///////////////---------
const passport = require('passport');
// import our passport functions
require("../authentication/passport.js")(passport, Admin);

app.use(passport.initialize());
app.use(passport.session());

app.post('/api/login', function(req, res, next) {
  console.log('in login');
  passport.authenticate('local', (err, user, info) => {
    if (err) {
        return next(err);
    }    
    if (!user) {
      console.log('You is not a user..or you are messed up');    
      res.status(401).send('You are not authenticated')
    }

    req.login(user, (err) => {
      if(err){
        return next(err);
      }
      res.send("Logged in")
      // return res.status(200).send('ok');
    })    
  })(req, res, next)
});

app.get('/api/logout', function(req, res){
  req.logout();
  console.log("logged out!!!!!!")
  return res.send();
});


const myAuthenticate = (req, res, next) => {
  if (!req.isAuthenticated()) {
      res.status(401).send('You are not authenticated')
  } else {
      return next()
  }
}

app.get("/api/checklogin", (req, res) => {
  if (!req.isAuthenticated()) {
    res.send('no')
  } else {
    res.send('ok')
  }
})




/* send static pages 
*/
app.get('*', function (req, res, next) { 
  // console.log("@@@33 "+JSON.stringify(req.headers)+req.headers["x-forwarded-for"]);
  recordVisitor(req.headers["x-forwarded-for"], req.headers["user-agent"])
  // console.log("kkkk: "+ req.originalUrl.indexOf('/article'))
  if(req.originalUrl.indexOf('/article')==0 || req.originalUrl.indexOf('/editArticle')==0 
    || req.originalUrl.indexOf('/login')==0 || req.originalUrl.indexOf('/admin')==0
    || req.originalUrl.indexOf('/static')==0 || req.originalUrl.indexOf('/page')==0) {
      res.sendFile("index.html", { root: viewsRoot })
  }else if(req.originalUrl.indexOf('/api')==0) {
      next();
  }else{
    res.sendFile(path.join(__dirname, '../../client/static/page404.html'));
  }
});

function recordVisitor(ip, agent){
  if(ip === undefined) return;
 
  Visitor.findOne({client_ip: ip}, function (error, v) {
    if (error) { console.error(error); } 
    // console.log("@@@ "+JSON.stringify(v)+ip);
    if(v !== null){
      v.client_ip = ip;
      v.date = myDate()
      v.agent = agent;
      v.save(function (error) {
        if (error) {
          console.log(error)
        }  
      })
    }else{
      var new_v = new Visitor({
        client_ip: ip,
        date: myDate(),
        agent: agent
      })
      new_v.save(function (error) {
        if (error) {
          console.log(error)
        }  
      })
    }
  })    
}

function format(t){
  // console.log("kkkkkk&& "+ t)
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
  

// Add new article
app.post('/api/articles', myAuthenticate, (req, res) => {

  var title = req.body.title;
  var content = req.body.content;
  var date = myDate();
  var tags = (req.body.tags==='')?null:req.body.tags.split("@");
  var new_post = new Article({
    title: title,
    content: content,
    tags: tags,
    date: date,
    isPublish: true,
    page_view: 0,
    comment_num: 0
  })

  new_post.save(function (error) {
    if (error) {
      console.log(error)
    }
  })

  if(tags !== null){
    addtags(tags, new_post._id)
  }
  
  res.send({
    success: true,
    message: 'Post saved successfully!'
  })
})


// Fetch all art
app.get('/api/articles/:sortby', (req, res) => {
  let sortby = req.params.sortby;
  let obj=({_id: -1});
  if(sortby === 'hits'){
    obj={page_view:-1};
  }else if(sortby === 'response'){
    obj={comment_num:-1};
  }
  else if(sortby === 'tags'){
    res.send({
      posts: []
    }); return;
  }
  
  Article.find({}, function (error, posts) {
    if (error) { console.error(error); }
    res.send({
      posts: posts
    })
  }).sort(obj)
})

// Fetch single art
app.get('/api/article/:id', (req, res) => {
  Article.findById(req.params.id, function (error, post) {
    if (error) { console.error(error); }
    res.send(post)  
    if(post !== null){
      post.update({$inc: {'page_view': 1}}).exec();
    }      
  })
})

// helper function find Article by _id
function findArticleby_id(i, obj) {
  var a = new Promise(function(resolve, reject) {
      Article.findOne({_id: obj.articles_id[i]}, function (error, art) {
        if (error) { console.error(error); }
        resolve(art)    
      })      
  })
  return a;
}
// Fetch articles by tagname
app.get('/api/articlesbytag/:tag', (req, res) => {
  let tag = req.params.tag;
  Tags.findOne({tagname: tag}, function(err,obj) { 
    if (err) { console.error(err); }
    if(obj===null){
      res.send(null);
    }else{
      let promiseArr=[];
      for(let i=0; i<obj.articles_id.length; i++){
        promiseArr.push(findArticleby_id(i, obj))
      }    
      Promise.all(promiseArr).then(function (posts) {
          // console.log("%%%%%%%art3333%%%: "+JSON.stringify(posts))
          posts.sort(function(a, b){return a.date - b.date})
          res.send({
            posts: posts
          })
      })        
    }
  });

})

// Fetch all tags
app.get('/api/alltags', (req, res) => {
  Tags.find({}, function (error, tg) {
    if (error) { console.error(error); }
    res.send({
      tags: tg
    })
  }).sort({tagname: 1})
})

// help function
function findindex(x, targ, arg){
  if(arg!==null){
    for(let i=0; i<x.length; i++){
      const str=x[i][arg];
      // console.log(encodeURIComponent(str)===encodeURIComponent(targ))     
      if(encodeURIComponent(str)===encodeURIComponent(targ))
        return i;
    }
  }
  else{    
    for(let i=0; i<x.length; i++){
      if(targ === x[i])
        return i;
    }
  }
  return -1;
}
function contains(arr, targ){
  for(let i=0;i<arr.length;i++){
    if(arr[i] === targ)
      return true;
  }
  return false;
}
function addtags(tags, art_id){
  for(let i=0; i<tags.length; i++){ // add this article to each refered tag 
    Tags.findOne({tagname: tags[i]}, function(err,obj) { 
      if (err) { console.error(err); }
      if(obj===null){
        let newtag= new Tags({tagname:tags[i], articles_id: art_id});
        newtag.save(function (error) {
          if (error) {
            console.log(error)
          }
        });
      }else{
        obj.articles_id.push(art_id)
        obj.save(function (error) {
          if (error) {
            console.log(error)
          }
        });        
      }
    });
  }
}
function deleteTags(tags, art_id){
  for(let i=0; i<tags.length; i++){ 
    // console.log('hey00000000000'+i)
    Tags.findOne({tagname: tags[i]}, function(err,obj) {
      if (err) { console.error(err); }
      if(obj === null){
        console.log("cannot find this tag");
        return;
      }
      let index=findindex(obj.articles_id, art_id, null);
      if(index !== -1){
        obj.articles_id.splice(index, 1)
      }
     
      if(obj.articles_id.length === 0){
        Tags.remove({
          tagname: tags[i]
        }, function(err, tg){
          if (err)
            res.send(err)
        })
      }else{
        obj.save(function (error) {
          if (error) {
            console.log(error)
          }
        }); 
      }
    })
  }
}
function removeAllComments(aid){
  Comment.deleteOne({
    article_id: aid
  }, function(err, post){
    if (err)
      return err
    return {
      success: true
    }
  })
}

// Delete a article
app.delete('/api/articles/:id', myAuthenticate, (req, res) => {
  // delete this article from refered tags
  Article.findById(req.params.id, function (error, post) {
    if (error) { console.error(error); }
    console.log('hey00000000000'+JSON.stringify(post))
    if(post !== null && post.tags!==null){
      deleteTags(post.tags, req.params.id);
      
    }      
  }).then((x)=>{
    Article.remove({
      _id: req.params.id
    }, function(err, post){
      if (err)
        res.send(err)
    })
    // also delete its comments
    removeAllComments(req.params.id)    
  })

  res.send('ok')
})

// Update a article
app.put('/api/articles/:id',  myAuthenticate, (req, res) => {
  Article.findById(req.body.id, function (error, post) { //#params
    if (error) { console.error(error); }

    // update tagss    
    let newtags = (req.body.tags==='')?null:req.body.tags.split("@")  
    if(newtags === null && post.tags !== null){
      deleteTags(post.tags, req.body.id)
    }else if(newtags !== null && post.tags === null){
      addtags(newtags, req.body.id)
    }else if(newtags !== null && post.tags !== null){
      let todelete=[];
      // delete old tags which are not in new tags
      for(let i=0;i<post.tags.length;i++){
        if(contains(newtags, post.tags[i])){
          continue;
        }else{console.log("????????????del:"+post.tags[i])
          todelete.push(post.tags[i]);
        }
      }
      console.log("newtg:"+JSON.stringify(newtags))
      console.log("old:"+JSON.stringify(post.tags))
      deleteTags(todelete, req.body.id)
      // to add new tags
      let toadd=[];
      for(let i=0;i<newtags.length;i++){
        if(contains(post.tags, newtags[i])){
          continue;
        }else{
          console.log("????????????add:"+newtags[i])
          toadd.push(newtags[i]);
        }
      }
      addtags(toadd, req.body.id)
    }
    post.title = req.body.title
    post.content = req.body.content
    post.tags = newtags
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

function updateArticleCmtNum(aid){
  Article.findOne({_id: aid}, function (error, art) {
    if (error) { console.error(error); return; }

      Comment.findOne({article_id: aid}, function (err, cmt) {
        if (err) { console.error(err); return; }
      
        if(cmt===null)
          art.comment_num = 0;
        else
          art.comment_num = cmt.comment_num; 
        art.save(function (error2) {
            if (error2) {
              console.log(error2)
            }        
        })
      })
   
  })
}

// Add a comment
app.post('/api/comment', (req, res) => {
  comments_cache[req.body.article_id]=null
  // console.log(req.body.article_id + '+++++++RESET CACHE+++++++!! '+comments_cache[req.body.article_id]);
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
      cmt[0].comment_num = cmt[0].comment_num+1;
      cmt[0].comment.push(new_cmt);  
    }else{
      cmt[0] = new Comment({
        article_id: req.body.article_id,
        comment_num: 1,
        comment: [new_cmt]
      })

    }


    cmt[0].save(function (error) {
        if (error) {
          console.log(error)
        }    
        updateArticleCmtNum(req.body.article_id, 0)
        res.send({
              success: true,
              message: 'Added a comment!'
        })    
    })
  

  })
  
})

let comments_cache={}
// Fetch cmts
app.get('/api/comment/:id', (req, res) => {
  if(comments_cache[req.params.id]!=null){
    res.send(comments_cache[req.params.id])
    // console.log('+++++++GET CACHE+++++++!! '+JSON.stringify(comments_cache[req.params.id]));
    return
  }

  Comment.find({article_id: req.params.id}, function (error, cmt) {
    if (error) { console.error(error); }
    
    if (cmt.length > 0){
      let mycmt=cmt[0];
      for(let i=0;i<mycmt.comment.length;i++){
        mycmt.comment[i].email='';
        if(mycmt.comment[i].comment_replies !== null){
          for(let j=0;j<mycmt.comment[i].comment_replies.length;j++)
            mycmt.comment[i].comment_replies[j].reply_email = '';
        }
      }
      //console.log('++++++++++++++=!!! '+JSON.stringify(mycmt));
      comments_cache[req.params.id]=mycmt
      res.send(mycmt)
    }
    else{
      res.send({comment: []})
    }
  })
})

// Update a cmt by add a reply to it
app.put('/api/comment/:id', (req, res) => {
  comments_cache[req.params.id]=null
  // console.log(req.params.id + '+++++++RESET CACHE+++++++!! '+comments_cache[req.params.id]);
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
    cmt[0].comment_num = cmt[0].comment_num+1; // increase cmt number count
    for(let i=0;i<comments.length; i++ ){
    //  console.log( JSON.stringify(comments[i]))
      if(comments[i]._id == req.body.parentId){
        // console.log( req.body.parentId+"##########3")
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
      updateArticleCmtNum(req.params.id, 0)
      res.send({
        success: true,
        message: 'Added a reply!'
      })
    }) 
  })
})

// Update a cmt by delete a reply
app.put('/api/deleteCommentReply/:id', (req, res) => {
  comments_cache[req.params.id]=null
  // console.log(req.params.id + '+++++++RESET CACHE+++++++!! '+comments_cache[req.params.id]);
  Comment.find({article_id: req.params.id}, function (error, cmt) {
    if (error) { console.error(error); }
    var comments = cmt[0].comment;
    cmt[0].comment_num = cmt[0].comment_num-1; // dec cmt number count
    for(let i=0;i<comments.length; i++ ){
    //  console.log( "%^^&&&&&&&&"+JSON.stringify(comments[i]))
      if(comments[i]._id == req.body.parentId){
        const str=req.body.childId
        if(str !== null){
          
          let index = findindex(comments[i]["comment_replies"], str, "_id")
          if(index !== -1){
            comments[i]["comment_replies"].splice(index, 1)
          }    
        }else{
          if(comments[i]["comment_replies"] !== null)
            cmt[0].comment_num -= comments[i]["comment_replies"].length; // dec children replies
          comments.splice(i, 1)          
        }           
        break;
      }
    }
    if(comments.length === 0){
      removeAllComments(req.params.id)
      updateArticleCmtNum(req.params.id, 0)
    }else{
      cmt[0].save(function (error) {
        if (error) {
          console.log(error)
        }  
        updateArticleCmtNum(req.params.id, null)      
      })
    }
    res.send({
          success: true,
          message: 'Update comments!'
    })        
  })
})

// Fetch a page
app.get('/api/otherpage/:pagename', (req, res) => {
  let page = req.params.pagename;

  OtherPage.find({ pageName: page}, function (error, data) {
    if (error) { console.error(error); }
    console.log('==============='+JSON.stringify(data))
    res.send({
      data: data
    })
  })
})

// Update a page
app.put('/api/editpage/:pagename',  myAuthenticate, (req, res) => {
  let page = req.params.pagename
  OtherPage.find({ pageName: page}, function (error, data) { //#params
    if (error) { console.error(error); }
    console.log(req.body.content+'=====33=========='+JSON.stringify(data))
    if(data.length == 0){
      var newone = new OtherPage({
        pageName: page,
        content: req.body.content,
        date: myDate(),
        page_view: 0
      })    
      newone.save(function (error) {
        if (error) {
          console.log(error)
        }
      })
    }else{
      data[0].content = req.body.content
      data[0].save(function (error) {
        if (error) {
          console.log(error)
        }       
      })
    }     
  })
  res.send({
    success: true
  })
})

app.listen(process.env.PORT || 8082)