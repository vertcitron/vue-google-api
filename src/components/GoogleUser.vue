<template>
  <div class="user">
    <div v-if="user" class="card">
      <img v-if="user.image" :src="user.image">
      <div class="infos">
        <div class="name">{{user.name}}</div>
        <div class="email">{{user.email}}</div>
        <button class="signout" @click="signout">
          Sign Out
        </button>
      </div>
    </div>
    <google-signin-btn v-else @click.native="signin"></google-signin-btn>
  </div>
</template>

<script>
import GoogleSigninBtn from './GoogleSigninBtn'

export default {
  name: 'GoogleUser',
  components: { GoogleSigninBtn },
  props: [ 'user' ],
  methods: {
    signin () {
      console.log('SIGN IN')
    },
    signout () {
      console.log('SIGN OUT')
    }
  }
}
</script>

<style lang="stylus" scoped>
.user
  display table
  margin 32px auto

  .card
    display flex
    flex-direction row
    justify-content space-between
    align-items center
    box-shadow 2px 2px 8px rgba(black, 0.25)
    border-radius 4px
    padding 32px
    background-color white

    .infos
      text-align right
      padding-left 32px
      .name
        font-size 20px
        font-weight bold
        margin-bottom 6px
      .email
        font-size 16px
        font-weight bold
        font-style italic
        margin-bottom 16px
</style>
