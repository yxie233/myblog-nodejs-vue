<template>
  <div class="article-page">
    <div class="header">
      <my-header></my-header>
    </div>

    <h2 align="left">{{title}}</h2>
     
    <div class="createTime">{{date}} (View:{{pageView}})</div>        
    <div v-if="tags != null" class="sort">
      Tags:&nbsp;
        <span v-for="tag in tags">
          <router-link class="title" v-bind:to="{ name: 'Posts', params: { tagSelect: tag } }">
            [{{tag}}]
          </router-link>
        </span>
    </div>
   
    <p v-highlight class="post-content" v-html="compiledMarkdown"></p>
 
    <div align="left" class="comments">
              
        <div v-if="comments.length>0">
          <h5 style="background:#e0dede; margin-bottom:0px;">Response({{cmtCount}})</h5>  
            <div v-for="item in comments">
              <table class="table">        
                <div class="rpl-names">       
                  <font color="#4682B4">&nbsp;<b>{{item.username}}</b></font>:
                </div>
                <p v-highlight class="rpl-content" v-html="mymarked(item.content)"></p>
               
                <div class="comments-rpl" v-if="item.comment_replies != null">    
                    <div v-for="reply in item.comment_replies">
                      <div class="rpl-cell">
                        <div class="rpl-names">
                          <font color="#4682B4">&nbsp;<b>{{reply.reply_username}}</b></font>
                          &nbsp;reply to <font color="#4682B4"><b>{{reply.reply_to}}</b></font>:  
                        </div>
                        <div v-highlight class="rpl-content-child" v-html="mymarked(reply.reply_content)"></div>                                         
                        <div class="timerpl">
                        
                          &nbsp;{{reply.reply_dateTime}}
                          <div style="float:right; text-align:right">
                            <span v-if="admin"><a @click="deleteCommentReply(item._id, reply._id)">Delete</a>&nbsp;</span>
                            <a href="#cmtbox" @click="replyComment(item._id, reply.reply_username)">Reply</a>&nbsp;
                          </div>                                
                       
                        </div>
                      </div>
                    </div>
                    <br />
                </div>

                <div class="timerpl">
                  <span>&nbsp;{{item.dateTime}}</span>
                  <div style="float:right; text-align:right">
                    <span v-if="admin"><a @click="deleteCommentReply(item._id, null)">Delete</a>&nbsp;</span>
                    <a href="#cmtbox" @click="replyComment(item._id, item.username)">Reply</a>&nbsp;
                  </div>
                </div>
               
              </table>
            </div>
          
        </div>
        <div v-else  style="background:#e0dede;">&nbsp;No response yet, leave the first comment.</div>
    </div>

      <div align="left" id="cmtbox" class="commentBox">
       
        
        <div class="infoInputLine">
         
            NAME <input type="text" name="commentUsername" placeholder="Your Name" v-model="commentUsername">
      
            EMAIL <input type="text" name="commentEmail" placeholder="Your Email" v-model="commentEmail">
         
          <td>
            <div v-if="this.commentReplyTo !== ''"> 
              @{{this.commentReplyTo}} <a href="#cmtbox" @click="resetComment" class="delt">X</a>
            </div>            
          </td>      

        </div>   
        <div class="previewCss" style="color:red; font-size:13px" v-if="this.warning !== ''">{{this.warning}}</div>
        <textarea rows="6" placeholder="Leave a response"  v-model="commentText"></textarea>

        <div class="previewCss">
          <div v-if="preview != false" class=“post-content”>
            <p v-highlight v-html="mymarked(commentText)"></p>
          </div>
        

          <a href="#cmtbox"  @click="mdpreview()">Preview  (Markdown is supported)</a>
          <div style="float:right">
             <button class="btn" @click="addComment">Post&nbsp;</button>          
          </div>
        </div>
        
      </div>

    <div class="footer">
      <my-footer></my-footer>
    </div>
  </div>
</template>

<script>
import myheader from './MyHeader';
import myFooter from './MyFooter';
import ArticleService from '@/services/ArticleService'
import marked from 'marked'


var rendererMD = new marked.Renderer()
marked.setOptions({
renderer: rendererMD,
gfm: true,
tables: true,
breaks: false,
pedantic: false,
sanitize: false, // if set true then some <html> tag will become string
smartLists: true,
smartypants: false
})

export default {
  name: 'showArticle',
  components: {
    MyHeader: myheader,
    MyFooter: myFooter
  },
  data () {
    return {
      title: '',
      content: '',
      tags: '',
      date: '',
      commentText: '',
      commentDate: '',
      commentUsername: '',
      commentEmail: '',
      commentReplyTo: '',
      comments: [],
      parentId: '',
      cmptReply: '',
      preview: false,
      cmtCount: 0,
      pageView: 0,
      warning: '',
      admin: false
    }
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.content)
    }/*,
    commentMD: function () {
      
      for (let i = 0; i < this.comments.length; i++) {
                this.comments[i].md = marked(this.comments[i].content);
      }
      return this.comments;
    }*/
  },
  mounted () {
    window.scroll(0, 0),
    this.checkLogin(),
    this.getPost(),
    this.getComments()     
  },
  methods: {
    mymarked: function (x) {
      return marked(x)
    },
    mdpreview: function(){      
      this.preview = !this.preview;
    },
    autoNewline: function(){
      // since markdown need 2 whitespace to start a new line, so I auto add it
      this.commentText = this.commentText.replace(/\n$/i,"  \n");       
    },
    async checkLogin () {
      await ArticleService.checkLogin()
        .then((response) => {
          // console.log(response["data"])
          if(response["data"]==="ok")
            this.admin = true
          else
            this.admin = false
        })
        .catch((errors) => {
          //  console.log("Post.vue err: "+errors)       
        })    
    },
    async getPost () {
      const response = await ArticleService.getArticle({
        id: this.$route.params.id
      })
      this.title = response.data.title
      this.content = response.data.content; //response.data.content.replace(/\n/gm,"<br/>")
      this.date= response.data.date
      this.tags = response.data.tags;
      this.pageView = response.data.page_view;
      //console.log('快看快看'+JSON.stringify(response.data.date))
      if(this.tags!== null && this.tags[0]=="")
        this.tags = null
    },
    resetComment () {
      this.commentUsername = '',
      this.commentEmail = '',
      this.commentText = '',
      this.commentReplyTo = '',
      this.parentId = ''
    },
    async addComment () {
      // check format of comment information
      if(this.commentUsername === ''){
        this.warning='NAME cannot be empty!';
        return;
      }else if(this.commentText === ''){
        this.warning='Response cannot be empty!'
        return;
      }else{        
        let emailMatch = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!emailMatch.test(this.commentEmail))
        // this.warning=""+emailMatch.matches();
		    {
          this.warning = 'Invalid EMAIL!'
          return;
        }else{this.warning = ''} 
      }

      if(this.parentId === ''){
        const response = await ArticleService.addComment({
          article_id: this.$route.params.id,
          username: this.commentUsername,
          email: this.commentEmail,
          content: this.commentText,
          comment_replies: null
        })
      }else{
        const response = await ArticleService.updateComment({
          id: this.$route.params.id,
          parentId: this.parentId,
          reply_username: this.commentUsername,
          reply_email: this.commentEmail,
          reply_to: this.commentReplyTo,
          reply_content: this.commentText
        })
      }
      this.getComments(); 
      this.resetComment() 
      // to do refresh page
    },
    async getComments () {
      const response = await ArticleService.getComments({
        id: this.$route.params.id
      })
      this.comments = response.data.comment;
      this.cmtCount = response.data.comment_num;
    },
    replyComment: function (parentId, name) {
      this.parentId = parentId
      this.commentReplyTo = name
    },
    async deleteCommentReply (parentID, childID) {
      const response = await ArticleService.deleteCommentReply({
        id: this.$route.params.id,
        parentId: parentID,
        childId: childID
      })
      this.getComments(); 
    }
  }
}


</script>
<style scoped>
.article-page {
  padding: 0 10px;   
  max-width: 640px;
  margin: 0 auto;
}
.createTime {
  text-align: left;
  font-size: 13px;
  color: #888888;
  margin-bottom: 10px;
}

.post-content {
  text-align: justify;
  word-break: break-all; 
  word-wrap: break-word;
  margin: 0 auto;
  margin-bottom: 20px;
}
.commentBox {
  margin: 0 auto;
  margin-top: 20px;
  margin-bottom: 20px;
  border-top:solid 1px #999;
  border-bottom:solid 1px #999;
  border-left:solid 1px #999;
  border-right:solid 1px #999;
}
.infoInputLine {
  margin-top: 3px;
  margin-left: 10px;
  width: 97%;
  outline:none;
}
.previewCss {
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 5px;
  word-break: break-all; 
  word-wrap: break-word;
}
.commentBox input{
  padding: 4px;
  margin-top: 2px;
  margin-bottom: 2px;
  margin-left: 2px;
  border: 1px solid #e0dede;
  outline-color: #ff00ff;
}
.commentBox textarea {
  width: 97%;
  margin-left: 2px;
  padding: 6px;
  border: 1px solid #e0dede;
  outline-color: #ff00ff;
  font-size: 14px;
}
.comments { 
  margin: 0 auto;
  margin-top: 40px;  
  margin-bottom:10px;
}
.comments-rpl {
  width: 90%;
  word-break: break-all; 
  word-wrap: break-word;
  margin: 0 auto;
  margin-bottom: 0px;
}
.table {
  width: 100%;
  margin-top: 2px;
  word-break: break-all; 
  word-wrap: break-word;
  border-top:solid 1px #104E8B;
  border-bottom:solid 1px #104E8B;
  border-left:solid 1px #104E8B;
  border-right:solid 1px #104E8B;
}
.rpl-names {  
  margin-top:1px;
  margin-left:1px;
  margin-right:1px;
  background: #AEEEEE;
}
.rpl-cell{
  overflow:auto; 
  max-height: 400px;
  margin-top: 2px;
  max-width: 576px;
  word-break: break-all; 
  word-wrap: break-word;
  border-top:solid 1px #104E8B;
  border-bottom:solid 1px #104E8B;
  border-left:solid 1px #104E8B;
  border-right:solid 1px #104E8B;
}
.rpl-content {
  margin:0 auto;
  overflow:auto;
  max-width:576px;
  max-height: 400px;
  word-break: break-all; 
  word-wrap: break-word;
  background: #fff;
  margin-top: 0px;
  text-align: left;
  border-top:solid 0px #636363;
  border-bottom:solid 0px #636363;
  border-left:solid 0px #636363;
  border-right:solid 0px #636363;
}
.rpl-content-child{
  margin-left: 10px;
  margin-right: 10px;
  overflow:auto; 
  max-height: 300px;
  max-width: 570px;
}
.timerpl {
  font-size: 12px;
  margin-left:1px;
  margin-right:1px;
  margin-bottom:1px;
  background: #AEEEEE;
}
a {
  color: #132051;
  text-decoration:none;
}
a:hover {color:#CC3300;}
.delt{
  color: red;
}

.sort {
  text-decoration: none;
  font-size: 13px;
  margin: 0 auto;
  text-align: left;
}
.sort span {
  margin-right: 5px;
  cursor: pointer;             
}

</style>

