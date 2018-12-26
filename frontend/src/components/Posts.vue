<template>
  <div class="homepage">
    <div class="header">
      <my-header></my-header>
    </div>

    <router-link class="title" v-bind:to="{ name: 'Login', params:{}}">login</router-link>

    <p class="line-title">
         <span class="line"></span><span class="title">posts</span>
    </p>
    <tr class="sort">
      Sort by: <span @click="getPosts('date')">[Date]</span>&nbsp;
      <span  @click="getPosts('hits')">[Hits]</span>&nbsp;
      <span @click="getPosts('tags')">[Tags]</span> 
    </tr>
    <span v-if="bytags">
      <span class="sort" v-for="tag in alltags">
          <span @click="getPostsByTag(tag.tagname)"> {{tag.tagname}} </span>
      </span>           
    </span>
    <div v-if="posts.length > 0">
      <ul class="posts-list">
        <li v-for="post in posts">
          
          <router-link class="title" v-bind:to="{ name: 'ShowArticle', params: { id: post._id } }">
            <a>{{ post.title}}</a>
          </router-link>
          <span v-if="sortbyhits">
            <span class="createTime">{{" (" + post.page_view +")"}}</span>
          </span>
          <span v-else>
            <span class="createTime">{{" (" + month[post.date.split("-")[1]] + " "+ post.date.split("-")[0] +")"}}</span>
          </span>
        </li>
              
      </ul>
    </div>
    <div v-else>
      Loading... You may refresh this page<br />
    </div>    

    <div class="footer">
      <my-footer></my-footer>
    </div>
    <div class="background"></div>
  </div>
</template>

<script>
import myheader from './MyHeader';
import myFooter from './MyFooter';
import ArticleService from '@/services/ArticleService'
export default {
  name: 'posts',
  components: {
    MyHeader: myheader,
    MyFooter: myFooter
  },
  data () {
    return {
      posts: [],
      month: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      sortbyhits: false,
      bytags: false,
      alltags: []
    }
  },
  mounted () {
    this.checkLogin(),
    this.getPosts('date')
  },
  methods: {
    async getPosts (sortby) {
      if(sortby === 'hits'){
        this.sortbyhits = true;
      }else{ this.sortbyhits = false; }
      if(sortby === 'tags'){
        this.bytags = true;
        this.fetchAllTags()
      }else{ this.bytags = false; }
      const response = await ArticleService.fetchArticles({ sortby: sortby })
      this.posts = response.data.posts
      /*
      for(let i=0; i < this.posts.length; i++){
        this.posts[i].date = this.posts[i].date.split(" ")[0]
      }*/
    },
    async checkLogin () {
      await ArticleService.checkLogin()
        .then((response) => {
          // console.log(response["data"])
          if(response["data"]==="ok")
            this.$router.push({ name: 'AdminPort' })
        })
        .catch((errors) => {
          //  console.log("Post.vue err: "+errors)       
        })    
    },
    async fetchAllTags () {
      const res = await ArticleService.fetchAllTags();
      this.alltags = res.data.tags
    },
    async getPostsByTag (tag) {
      const res = await ArticleService.getArticlesByTag({tag: tag});
      this.posts = res.data.posts
    }
  }
}
</script>
<style scoped>
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

.sort span {
  cursor: pointer;                
}
.sort span:hover {
  color: #CC3300;              
}
.sort span :active {
                        color: #111;
                        font-weight: bold;
                    }

.fmttr {
   width: 100%;
}

.posts {
  width: 100%;
  text-align: center;
}
.posts .line {
  display: inline-block;
  width: 280px;
  border-top: 1px solid #ccc ;
}
.posts .txt {
  font-size: 14px;
  font-weight: bold;
  color: #999999;
  vertical-align: sub;
}


.homepage {
  height: 100%;
  padding: 0 10px;   
  max-width: 640px;
  margin: 0 auto;
}
   
.posts-list {
  margin-bottom: 30px;
  padding: 0 10px;
  list-style: none;
            
}
.posts-list li {
  font-size: 14px;
  text-align: left;
  margin-bottom: 10px;
  word-break: break-all; 
  word-wrap: break-word;              
}
.title {
  color: #132051;
  cursor: pointer;
  text-decoration: underline;
}
.createTime {
  font-size: 12px;
}
.line-title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.line-title .title {
  text-decoration: none;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 13px;
  top: 0px;
  padding: 0 10px;
  color: #999;
  background-color: white;
}
.line-title .title::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 1px;
  background-color: #999;
}

.background {
  position: fixed;
  left: 0;
  top: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background: url("../assets/posts.png") no-repeat fixed top;
  background-size: cover;
  opacity: 0.2;
  filter: blur(3px);
}
</style>