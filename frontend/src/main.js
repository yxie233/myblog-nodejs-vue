import Vue from 'vue'
import App from './App'
import router from './router'
import hljs from '../node_modules/highlight.js/lib/highlight.js'
import '../node_modules/highlight.js/styles/monokai-sublime.css' //样式文件

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})
