<template>
  <div class="login">
    <h1>Admin</h1>
      <div class="form">
        <div v-if="failed"> 
            Invalid username or password!
        </div> 
        <div>
          <input type="text" name="name" placeholder="username" v-model="username">
        </div>
        <div>
          <input type="password" name="password" placeholder="password" v-model="password">
        </div>
        <div>
          <button class="app_login_btn" @click="login">Login</button>
        </div>
      </div>
  </div>
</template>

<script>
import ArticleService from '@/services/ArticleService'
export default {
  name: 'EditArticle',
  data () {
    return {
      username: '',
      password: '',
      failed: false
    }
  },
  mounted () {
   
  },
  methods: {
    async login () {
      await ArticleService.loginAdmin({
        username: this.username,
        password: this.password
      })
      .then(response => {
        console.log("Logged in")
        this.$router.push({ name: 'AdminPort' })
      })
      .catch(errors => {
        console.log("failed login");
        // this.username = '';
        // this.password = '';
        this.failed = true;
      });

    }
  }
}
</script>
<style type="text/css" scoped>
.form input {   
  width: 400px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 14px;
}
.form div {
  margin: 20px;
}
.app_login_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 200px;
  border: none;
  cursor: pointer;
}
</style>