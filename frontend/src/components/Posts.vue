<template>
  <div class="posts">
    <img src="../assets/logo.png">
    <h3>Yiyun</h3>
     
    <h3 align="center" style="margin-bottom: 10px;">------------------------------------------ABOUT  ME-----------------------------------------</h3>

    <h3 align="center" >---------------------------------------------POSTS--------------------------------------------</h3>
   
    <div v-if="posts.length > 0" class="table-wrap">
      <div>
        <router-link v-bind:to="{ name: 'NewArticle' }" class="">Add article</router-link>
      </div>
      <table align="left">
        <tr v-for="post in posts">
          <router-link v-bind:to="{ name: 'ShowArticle', params: { id: post._id } }">
            <td><u>{{ post.title}}</u></td>
          </router-link>
          {{" ("+post.date.split("T")[0] +")"}}
         
          <td align="center" width="130px">
            <router-link v-bind:to="{ name: 'EditArticle', params: { id: post._id } }">Edit</router-link> |
            <a href="#" @click="deletePost(post._id)">Delete</a>
          </td>
          
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      There are no posts.. Lets add one now <br /><br />
      <router-link v-bind:to="{ name: 'NewArticle' }" class="add_post_link">Add Post</router-link>
    </div>
 

  </div>
</template>

<script>
//import PostsService from '@/services/PostsService'
import ArticleService from '@/services/ArticleService'
export default {
  name: 'posts',
  data () {
    return {
      posts: []
    }
  },
  mounted () {
    this.getPosts()
  },
  methods: {
    async getPosts () {
      const response = await ArticleService.fetchArticles()
      this.posts = response.data.posts
    },
    async deletePost (id) {
      await ArticleService.deleteArticle(id)
      this.getPosts()
      this.$router.push({ name: 'Posts' })
    }
  }
}
</script>
<style type="text/css">
.table-wrap {
  width: 50%;
  margin: 0 auto;
  text-align: center;
  font-size: 14px;
}
table th, table tr {
  text-align: left;
}
table thead {
  background: #f2f2f2;
}
table tr td {
  padding: 0px;
}
table tr:nth-child(0) {
  background: #f2f2f2;
}
a {
  color: #132051;
  text-decoration: none;
}
a.add_post_link {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
</style>