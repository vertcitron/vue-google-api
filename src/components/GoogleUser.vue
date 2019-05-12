<template>
  <div class="user">
    <div v-if="value" class="card">
      <img v-if="value.image" :src="value.image">
      <div class="infos">
        <div class="name">{{value.name}}</div>
        <div class="email">{{value.email}}</div>
        <button class="signout" @click="signout">
          Sign Out
        </button>
      </div>
    </div>
    <google-signin-btn v-else @click="signin"></google-signin-btn>
  </div>
</template>

<script>
export default {
  name: 'GoogleUser',
  components: {},
  props: [ 'value' ],
  methods: {
    signin () {
      this.$gapi.signIn()
        .then(user => {
          this.$emit('input', user)
        })
    },
    signout () {
      this.$gapi.signOut()
        .then(() => {
          this.$emit('input', undefined)
        })
    }
  }
}
</script>

<style scoped>
.user {
  display: table;
  margin: 32px auto;
}

.user .card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  padding: 32px;
  background-color: white;
}

.user .card .infos {
  text-align: right;
  padding-left: 32px;
}

.user .card .infos .name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.user .card .infos .email {
  font-size: 16px;
  font-weight: bold;
  font-style: italic;
  margin-bottom: 16px;
}
</style>
