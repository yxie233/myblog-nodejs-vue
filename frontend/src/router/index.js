import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/HelloWorld'
import NewArticle from '@/components/NewArticle'
import Posts from '@/components/Posts'
import NewPost from '@/components/NewPost'
import EditPost from '@/components/EditPost'
import ShowArticle from '@/components/ShowArticle'
import EditArticle from '@/components/EditArticle'

Vue.use(Router)

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
      path: '/articles/:id',
      name: 'EditArticle',
      component: EditArticle
    }
  ]
})