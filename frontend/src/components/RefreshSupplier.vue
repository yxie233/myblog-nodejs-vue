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
      this.$router.push({ name: this.$route.params.page})
    }
  }
}
</script>