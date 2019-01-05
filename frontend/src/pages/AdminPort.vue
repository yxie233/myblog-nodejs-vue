<template>
  <div class="homepage">
    <div class="header">
      <my-header></my-header>
    </div>

    <line-title :title="'POSTS (' + posts.length + ')'"></line-title>
    <div>
        <router-link v-bind:to="{ name: 'NewArticle' }" class=""><u>Add article</u></router-link>
        &nbsp;<a href="#" @click="logout()"><u>Logout</u></a>
    </div>
    <p class="sort">
      Sort by: <span :class="{ active: sortby === 'date'}"  @click="getPosts('date')">[Date]</span>
      <span :class="{ active: sortby === 'hits'}" @click="getPosts('hits')">[Hits]</span>
      <span :class="{ active: sortby === 'tags'}" @click="getPosts('tags')">[Tags]</span>  
    </p>
    <p class="sort" v-if="bytags">--
      <span v-for="tag in alltags">
          <span :class="{ active: tagSelected === tag.tagname}" @click="getPostsByTag(tag.tagname)"> [{{tag.tagname}}] </span>
      </span>           
    </p>

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
            <span class="createTime">{{" (" + month[post.date.split("-")[1]-0] + " "+ post.date.split("-")[0] +")"}}</span>
          </span>         
         
          <div style="float:right; text-align:right">
            <router-link v-bind:to="{ name: 'EditArticle', params: { id: post._id } }">Edit</router-link> |
            <a href="#" @click="deletePost(post._id)">Delete</a>
          </div>
        </li>
              
      </ul>
    </div>
    <!--div v-else>
      Loading... <br />
    </div-->    

    <div class="footer">
      <my-footer></my-footer>
    </div>
    <div class="background"></div>
  </div>
</template>

<script>
import linetitle from '@/components/LineTitle';
import myheader from '@/components/MyHeader';
import myFooter from '@/components/MyFooter';
import ArticleService from '@/services/ArticleService'
export default {
  name: 'posts',
  components: {
    MyHeader: myheader,
    MyFooter: myFooter,
    LineTitle: linetitle
  },
  data () {
    return {
      posts: [],
      month: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      sortbyhits: false,
      bytags: false,
      sortby: 'date',
      tagSelected: '',
      alltags: []
    }
  },/*
  created () {
    this.$http.get('/mysession').then(function(result){
        if(result.status==200){
            console.log(result.body);
            this.user=result.body
        }
    }, function(res){
            console.log('fail login：'+res.status);
            this.$router.push('/login');
    });  
  },*/
  mounted () {
    this.checkLogin(),
    this.getPosts('date')
  },
  methods: {
    async getPosts (sortby) {
      this.sortby = sortby
      if(sortby === 'hits'){
        this.sortbyhits = true;
        this.tagSelected = '';
      }else{ this.sortbyhits = false; }
      if(sortby === 'tags'){
        this.bytags = true;
        this.fetchAllTags()
      }else{ this.bytags = false; this.tagSelected = '';}
      const response = await ArticleService.fetchArticles({ sortby: sortby })
      this.posts = response.data.posts
      /*
      for(let i=0; i < this.posts.length; i++){
        this.posts[i].date = this.posts[i].date.split(" ")[0]
      }*/
    },
    async deletePost (id) {
      await ArticleService.deleteArticle(id)
      this.getPosts('date')
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
    },
    async logout () {
      const response = await ArticleService.logout()
      .then((response) => {
          // console.log(response)  
          this.$router.push("/")                  
      })
      .catch((errors) => {
          console.log(errors)          
      })
    },
    async fetchAllTags () {
      const res = await ArticleService.fetchAllTags();
      this.alltags = res.data.tags
    },
    async getPostsByTag (tag) {
      this.tagSelected = tag
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
a:hover {color:#CC3300;text-decoration:none;}
.sort {
  font-size: 13px;
  margin: 0 auto;
  text-align: left;
}
.sort span {
  margin-right: 5px;
  cursor: pointer;             
}
.sort span:hover {
  color: #CC3300;              
}
.active { 
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