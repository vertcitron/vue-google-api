<template>
  <div id="app">
    <h1>Vue Google API</h1>
    <google-user v-model="user"></google-user>
    <div v-if="user">
      <button @click="request">make a GET people/me request with names and email addresses.</button>
    </div>
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
  methods: {
    request () {
      this.$gapi.request({
        path: 'https://people.googleapis.com/v1/people/me',
        method: 'GET',
        params: {
          personFields: 'names,emailAddresses'
        }
      }).then(response => {
        console.log(response.result)
      })
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
<style>
body {
  font-family: sans-serif;
  color: #666;
  background-color: #f8f8f8;
}
#app {
  text-align: center;
  margin-top: 60px;
}
#app button {
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: 2px 2px 6px rgba(0,0,0,0.25);
  background-color: #eee;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #808080;
}
#app button:hover {
  background-color: #2f2f2f;
  box-shadow: 3px 3px 12px rgba(0,0,0,0.33);
  color: #fff;
}
#app button:focus {
  outline: none;
}
</style>
