import Vue from 'vue'
import Router from 'vue-router'
import NewArticle from '@/components/NewArticle'
import Posts from '@/components/Posts'
import NewPost from '@/components/NewPost'
import EditPost from '@/components/EditPost'
import ShowArticle from '@/components/ShowArticle'
import EditArticle from '@/components/EditArticle'
import Login from '@/components/Login'
import AdminPort from '@/components/AdminPort'
import RefreshSupplier from '@/components/RefreshSupplier'

Vue.directive("highlight", (el) => {
  const blocks = el.querySelectorAll("pre code");
  blocks.forEach((block) => {
      hljs.highlightBlock(block);
  });
});
// Vue.directive('highlight',{
//   update: function (el) {  
//   let blocks = el.querySelectorAll('pre code');
//       blocks.forEach((block)=>{
//         hljs.highlightBlock(block)
//       })
//   }
// })


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Posts',
      component: Posts
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/posts/new',
      name: 'NewPost',
      component: NewPost
    },
    {
      path: '/posts/:id',
      name: 'EditPost',
      component: EditPost
    },
    {
      path: '/article/new',
      name: 'NewArticle',
      component: NewArticle
    },
    {
      path: '/article/:id',
      name: 'ShowArticle',
      component: ShowArticle
    },
    {
      path: '/editArticle/:id',
      name: 'EditArticle',
      component: EditArticle
    },
    {
      path: '/admin',
      name: 'AdminPort',
      component: AdminPort
    },
    {
      path: '/refreshpage',
      name: 'RefreshSupplier',
      component: RefreshSupplier
    }
  ]
})