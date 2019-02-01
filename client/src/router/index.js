import Vue from 'vue'
import Router from 'vue-router'
import NewArticle from '@/pages/NewArticle'
import Posts from '@/pages/Posts'
import ShowArticle from '@/pages/ShowArticle'
import EditArticle from '@/pages/EditArticle'
import Login from '@/pages/Login'
import AdminPort from '@/pages/AdminPort'
import ProjectsAbout from '@/pages/ProjectsAbout'
import EditPage from '@/pages/EditPage'
import RefreshSupplier from '@/components/RefreshSupplier'

Vue.directive("highlight", (el) => {
  const blocks = el.querySelectorAll("pre code");
  blocks.forEach((block) => {
      hljs.highlightBlock(block);
  });
});

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
    },
    {
      path: '/page/:page',
      name: 'ProjectsAbout',
      component: ProjectsAbout
    },
    {
      path: '/admin/editPage/:page',
      name: 'EditPage',
      component: EditPage
    }
  ]
})