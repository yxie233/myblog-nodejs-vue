<template>
  <div id="posts">
    <div class="header">
      <my-header></my-header>
    </div>
    <!--img src="../assets/logo.png"-->

    <h3 align="center" >---------------------------------------------POSTS--------------------------------------------</h3>
   
    <div v-if="posts.length > 0" class="table-wrap">
      <div>
        <router-link v-bind:to="{ name: 'NewArticle' }" class="">Add article</router-link>
      </div>
      <table align="left" class="fmttr">
        <tr v-for="post in posts">
          
          <router-link v-bind:to="{ name: 'ShowArticle', params: { id: post._id } }">
            <td><u>{{ post.title}}</u></td>
          </router-link>
          {{" (" + post.date.split("-")[2] +" " + month[post.date.split("-")[1]] + ", "+ post.date.split("-")[0] +")"}}
         
          <div style="float:right; text-align:right">
            <router-link v-bind:to="{ name: 'EditArticle', params: { id: post._id } }">Edit</router-link> |
            <a href="#" @click="deletePost(post._id)">Delete</a>
          </div>
          
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
import myheader from './MyHeader';
import ArticleService from '@/services/ArticleService'
export default {
  name: 'posts',
  components: {
    MyHeader: myheader
  },
  data () {
    return {
      posts: [],
      month: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  },
  mounted () {
    this.getPosts()
  },
  methods: {
    async getPosts () {
      const response = await ArticleService.fetchArticles()
      this.posts = response.data.posts
      for(let i=0; i < this.posts.length; i++){
        this.posts[i].date = this.posts[i].date.split(" ")[0]
      }
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
.fmttr {
   width: 100%;
}

</style>