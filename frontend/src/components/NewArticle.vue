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
        <div>
          <textarea rows="15" cols="15" placeholder="CONTENT" v-model="content"></textarea>
        </div>
        <div>
          <button class="app_post_btn" @click="addArticle">Post</button>
        </div>
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
  methods: {
    async addArticle() {
      await ArticleService.addArticle({
        title: this.title,
        tags: this.tags,
        content: this.content
      })
      this.$router.push({ name: 'Posts' })
    }
  }
}
</script>
<style type="text/css">
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
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
</style>