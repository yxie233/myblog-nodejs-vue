<template>
  <div class="articles">
    <h1>Edit article</h1>
      <div class="form" style="margin-bottom: 400px">
        <div>
          <input type="text" name="title" placeholder="TITLE" v-model="title">
        </div>
        <div>
          <input type="text" name="tags" placeholder="TAG" v-model="tags">
        </div>
        <div class="content">
          <div class="left"><textarea rows="15" cols="15" @input="autoNewline" placeholder="CONTENT" v-model="content"></textarea></div>
          <div class="right"> <p v-highlight style="text-align: justify; word-break: break-all;" v-html="mymarked(content)"></p></div>
        </div>
       
        
      </div>
      <div >
          <button class="app_post_btn" @click="updatePost">Update</button>
      </div>
  </div>
</template>

<script>
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
  name: 'EditArticle',
  data () {
    return {
      title: '',
      content: '',
      tags: ''
    }
  },
  mounted () {
    // this.checkLogin(),
    this.getPost()
  },
  methods: {
    mymarked: function (x) {
      return marked(x)
    },
    async getPost () {
      const response = await ArticleService.getArticle({
        id: this.$route.params.id
      })
      this.title = response.data.title,
      this.content = response.data.content
      if( response.data.tags !== null){
        for(let i=0; i < response.data.tags.length;i++){
          this.tags+=response.data.tags[i]+'@';
        }
        this.tags = this.tags.substring(0, this.tags.length-1)
      }
      
    },
    autoNewline: function(){
      // since markdown need 2 whitespace to start a new line, so I auto add it
      this.content = this.content.replace(/\n$/i,"  \n");       
    },
    async updatePost () {
      await ArticleService.updateArticle({
        id: this.$route.params.id,
        title: this.title,
        content: this.content,
        tags: this.tags
      })
      this.$router.push({ name: 'Posts' })
    },
    async checkLogin () {
      await ArticleService.checkLogin()
        .then((response) => {
          // console.log(response)
          if(response["data"]==="no")
            this.$router.push({ name: 'Posts' })
        })
        .catch((errors) => {
          console.log(errors)
          this.$router.push("/")
        })
    }
  }
}
</script>
<style type="text/css">
.form input {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.content {
  width:85%;
  margin:0 auto;

}
.left {
 
  float: left;
  font-size: 12px;
}
.form textarea {
  height:300px;
  margin-left: 30%;
  width: 400px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.right {
  width: 400px;
  height:330px;
  float: right;
  font-size: 12px;
  overflow:scroll;
}
.form div {
  margin: 20px;
}
.app_post_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
button:hover {
  background: #fff;
  color: #4d7ef7;
  border: 1px solid #4d7ef7;
}
</style>