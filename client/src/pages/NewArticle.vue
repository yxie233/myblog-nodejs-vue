<template>
  <div class="articles">
    <h1>Add article</h1>
      <div class="form">
        <div>
          <input type="text" name="title" placeholder="TITLE" v-model="title">
        </div>
        <div>
          <input type="text" name="tags" placeholder="TAG" v-model="tags">
        </div>
        
      </div>
      <div>
          <textarea placeholder="CONTENT" v-model="content"></textarea>
      </div>
      <div>
        <button class="app_post_btn" @click="addArticle">Post</button>
      </div>
  </div>
</template>

<script>
import ArticleService from '@/services/ArticleService'
export default {
  name: 'NewArticle',
  data () {
    return {
      title: '',
      tags: '',
      content: ''
    }
  },
  mounted () {
    this.checkLogin()
  },
  methods: {
    async addArticle() {
      await ArticleService.addArticle({
        title: this.title,
        tags: this.tags,
        content: this.content
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
<style scoped>

.form input{
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
textarea {  
  height: 200px;
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
  align-items: center;
}
.app_post_btn {
  margin: 20px;
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 260px;
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