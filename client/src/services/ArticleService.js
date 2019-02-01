import Api from '@/services/Api'

export default {
  fetchArticles (params) {
    return Api().get('api/articles/' + params.sortby)
  },
  addArticle (params) {
    return Api().post('api/articles', params)
  },
  getArticle (params) {
    return Api().get('api/article/' + params.id)
  },
  deleteArticle (id) {
    return Api().delete('api/articles/' + id)
  },
  updateArticle (params) {
    return Api().put('api/articles/' + params.id, params)
  },
  addComment (params){
    return Api().post('api/comment', params)
  },
  getComments (params) {
    return Api().get('api/comment/' + params.id)
  },
  updateComment (params) {
    return Api().put('api/comment/' + params.id, params)
  },
  deleteCommentReply (params) {
    return Api().put('api/deleteCommentReply/' + params.id, params)
  },
  fetchAllTags () {
    return Api().get('api/alltags')
  },
  loginAdmin (params) {
    return Api().post('api/login', params)
  },
  checkLogin () {
    return Api().get("api/checklogin")
  },
  logout () {
    return Api().get("api/logout")
  },
  getArticlesByTag (params) {
    return Api().get('api/articlesbytag/' + params.tag)
  },
  getPage (params) {
    return Api().get('api/otherpage/' + params.page)
  },
  updatePage (params) {
    return Api().put('api/editpage/' + params.page, params)
  }
}