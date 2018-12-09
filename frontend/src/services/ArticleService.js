import Api from '@/services/Api'

export default {
  fetchArticles () {
    return Api().get('articles-api')
  },
  addArticle (params) {
    return Api().post('articles-api', params)
  },
  getArticle (params) {
    return Api().get('articles-api/' + params.id)
  },
  deleteArticle (id) {
    return Api().delete('articles-api/' + id)
  },
  updateArticle (params) {
    return Api().put('articles-api/' + params.id, params)
  },
  addComment (params){
    return Api().post('comment-api', params)
  },
  getComments (params) {
    return Api().get('comment-api/' + params.id)
  },
  updateComment (params) {
    return Api().put('comment-api/' + params.id, params)
  }
}