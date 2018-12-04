<template>
  <div class="articles">
    <h2 align="left" class="post-content wz">{{title}}</h2>
      <div align="center" class="form">
        <div align="left" class="post-content wz">{{date.split("T")[0]+" ("+date.split("T")[1].split(".")[0]+")"}}</div> 
        <div v-if="tags[0]===''"></div> 
        <div v-else>
          <div align="left" class="post-content wz">
            <tr>Tags: <td v-for="tag in tags">{{tag+"|"}}</td></tr>
          </div> 
        </div>
  

        <div align="left" class="post-content wz" v-html="content"></div>
       
      </div>
  </div>
</template>

<script>
import ArticleService from '@/services/ArticleService'
export default {
  name: 'showArticle',
  data () {
    return {
      title: '',
      content: '',
      tags: '',
      date: ''
    }
  },
  mounted () {
    this.getPost()
  },
  methods: {
    async getPost () {
      const response = await ArticleService.getArticle({
        id: this.$route.params.id
      })
      this.title = response.data.title,
      this.content = response.data.content.replace(/\n/gm,"<br/>"),
      this.date = response.data.date,
      this.tags = response.data.tags
    }
  }
}
</script>
<style type="text/css">
.form input, .form textarea {
  width: 60%;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}

.post-content {
  width: 66%;
  margin: 0 auto;
  margin-bottom: 20px;
}
</style>

