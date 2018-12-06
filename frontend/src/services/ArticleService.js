import Api from '@/services/Api'

export default {
  fetchArticles () {
    return Api().get('articles')
  },
  addArticle (params) {
    return Api().post('articles', params)
  },
  getArticle (params) {
    return Api().get('articles/' + params.id)
  },
  deleteArticle (id) {
    return Api().delete('articles/' + id)
  },
  updateArticle (params) {
    return Api().put('articles/' + params.id, params)
  },
  addComment (params){
    return Api().post('comment', params)
  },
  getComments (params) {
    return Api().get('comment/' + params.id)
  },
  updateComment (params) {
    return Api().put('comment/' + params.id, params)
  }
}