<template>
  <div class="otherPages">
    <div class="header">
      <my-header></my-header>
    </div>

    <line-title :title=" '' + page "></line-title>
     
       
  
    <div v-if="admin">
      <div class="createTime">{{date}}   
        <router-link v-bind:to="{ name: 'EditPage', params: { page: page } }"> Edit Page</router-link>
      </div>  
    </div>
    <p v-highlight class="post-content" v-html="compiledMarkdown"></p>

    <div class="footer">
      <my-footer></my-footer>
    </div>
  </div>
</template>

<script>
import linetitle from '@/components/LineTitle';
import myheader from '@/components/MyHeader';
import myFooter from '@/components/MyFooter';
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
  name: 'projectsAbout',
  components: {
    MyHeader: myheader,
    MyFooter: myFooter,
    LineTitle: linetitle
  },
  data () {
    return {
      title: '',
      content: '',
      tags: '',
      date: '',
      page: '',
   
      data: '',

      pageView: 0,
  
      admin: false
    }
  },
  computed: {
    compiledMarkdown: function () {
      if(this.content === undefined)
        return '';
      return marked(this.content)
    }
  },
  mounted () {
    window.scroll(0, 0),
    this.checkLogin(),
    this.getPost()
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
      this.page = this.$route.params.page
      const response = await ArticleService.getPage({ page: this.page })
      this.data = response.data.data[0]
      if(this.data !== undefined){
        this.content = this.data.content
        this.date= this.data.date
      }
      
      // this.tags = response.data.tags;
      // this.pageView = response.data.page_view;
      // //console.log('kkkk'+JSON.stringify(response.data.date))
      // if(this.tags!== null && this.tags[0]=="")
      //   this.tags = null
    }
  }
}


</script>
<style scoped>
.otherPages {
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
  width: 91%;
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
}
a:hover {
  color:#CC3300;  
  text-decoration:none;
}
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
.btn {
  background: #4d7ef7;
  color: #fff;
  padding: 3px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 60px;
  border: none;
  cursor: pointer;
  border-radius: 2px;
}
button:hover {
  background: #fff;
  color: #4d7ef7;
  border: 1px solid #4d7ef7;
  border-radius: 2px;
}
</style>

