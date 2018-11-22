<template>
  <div id="app">
    <h1>Vue Google API</h1>
    <google-user :user="user"></google-user>
  </div>
</template>

<script>
import GoogleUser from '@/components/GoogleUser'
export default {
  name: 'app',
  components: { GoogleUser },
  data () {
    return {
      user: undefined
    }
  },
  mounted () {
    this.$gapi.currentUser()
      .then(user => {
        this.user = user
      })
  }
}
</script>
<style lang="stylus">

base-text-color = #666
base-bckg-color = #f8f8f8
primary = #eee

body
  font-family sans-serif
  color base-text-color
  background-color base-bckg-color

#app
  text-align center
  margin-top 60px

  button
    border none
    padding 8px 16px
    border-radius 4px
    box-shadow 2px 2px 6px rgba(black, 0.25)
    background-color primary
    cursor pointer
    font-size 16px
    font-weight bold
    color lighten(base-text-color, 10)
    &:hover
      background-color darken(primary, 30)
      box-shadow 3px 3px 12px rgba(black, 0.33)
      color white
    &:focus
      outline none
</style>
