import Vue from 'vue'
import App from './App'
import router from './router'
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css' //样式文件


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})



Vue.directive('highlight',{
  update: function (el) {  
  let blocks = el.querySelectorAll('pre code');
      blocks.forEach((block)=>{
        hljs.highlightBlock(block)
      })
  }
})