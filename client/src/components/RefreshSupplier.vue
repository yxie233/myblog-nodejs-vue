<template/>

<script>
export default {
  name: 'RefreshSupplier',
  data () {
    return {
    }
  },
  mounted () {
    this.goto()
  },
  methods: {
    goto: function() {     
      let nextpage =  this.$route.params.page
      let pagename = (nextpage=='posts')? 'Posts': 'ProjectsAbout'
      this.$router.push({ name: pagename, params: { page: nextpage }})
    }
  }
}
</script>