<template>
  <div id="app">
    <h1>Vue Google API</h1>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  mounted () {
    this.$gapi.currentUser()
      .then(user => {
        console.log('user :', user)
      })
  }
}
</script>
<style lang="stylus">
#app
  font-family sans-serif
  text-align center
  color #666
  margin-top 60px
</style>
