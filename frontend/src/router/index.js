import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/HelloWorld'
import NewArticle from '@/components/NewArticle'
import Posts from '@/components/Posts'
import NewPost from '@/components/NewPost'
import EditPost from '@/components/EditPost'
import ShowArticle from '@/components/ShowArticle'
import EditArticle from '@/components/EditArticle'
//import mavonEditor from 'mavon-editor'
//import 'mavon-editor/dist/css/index.css'

Vue.use(Router)
//Vue.use(mavonEditor)

export default new Router({
  mode: 'history',
  routes: [/*
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },*/
    {
      path: '/',
      name: 'Posts',
      component: Posts
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
    }
  ]
})