<template lang="html">
    <header>
        <img :src="require('../assets/logo.png')" alt="avatar" class="avatar">
        <div class="name">Yiyun</div><br>
        <div class="denote">Major in Computer Science.</div>
        <br><br>
        <div class="navigator" align="center">
            <router-link class="title" v-bind:to="{ name: 'RefreshSupplier', params: { page: 'posts' } }"><span>Blog</span></router-link>
            <router-link class="title" v-bind:to="{ name: 'RefreshSupplier', params: { page: 'projects' } }"><span>Projects</span></router-link>
            <router-link class="title" v-bind:to="{ name: 'RefreshSupplier', params: { page: 'about' } }"><span>About Me</span></router-link>
            <span v-if="notlogin"><router-link class="title" v-bind:to="{ name: 'Login', params:{}}">Login</router-link></span>
            <span v-else><a href="#" @click="logout()">Logout</a></span>
        </div>
        <br>
    </header>
</template>

<script>
import ArticleService from '@/services/ArticleService'
export default {
  name: 'myheader',
  data () {
    return {
      notlogin: true
    }
  },
  mounted () {
    this.checkLogin()
  },
  methods: { 
    async checkLogin () {
      await ArticleService.checkLogin()
        .then((response) => {
          // console.log(response["data"])
          if(response["data"]==="ok")
            this.notlogin = false
        })
        .catch((errors) => {
          //  console.log("Post.vue err: "+errors)       
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
    }
  }
}
</script>

<style>
header {
    font-family:  Arial, Georgia;
}
.avatar {
    transform: translateY(-10%);
    width:120px; 
    height:120px;
    border-radius:50%;    
}
.name {    
    font-size: 14px;
    font-weight: bold;
    color: #000;
}
.denote {
    font-size: 13px;
    color: #636363;
}
.navigator {
    text-decoration: none;
}
.navigator span {
    margin-right: 5px;
}
a {
  color: #132051;  
}
a:hover {color:#CC3300;text-decoration:none;}
</style>