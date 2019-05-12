<template>
  <div class="g-signin" :class="customClass"
    @click.prevent.stop="$emit('click')"
    @keypress.enter.prevent.stop="$emit('click')">
    <span class="icon"></span>
    <span class="text">{{label}}</span>
  </div>
</template>

<script>
export default {
  name: 'GoogleSignInBtn',
  props: {
    label: { type: String, default: 'Sign In with Google' },
    'custom-class': { type: String, default: '' }
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto");
.g-signin {
  display: inline-block;
  background: #fff;
  color: #555;
  border-radius: 5px;
  box-shadow: 1px 1px 4px rgba(0,0,0,0.25);
  white-space: nowrap;
}
.g-signin:hover {
  cursor: pointer;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.5);
  color: #000;
}
.g-signin span.icon {
  background-image: url("https://developers.google.com/identity/images/g-logo.png");
  background-size: 26px 26px;
  background-repeat: no-repeat;
  background-position: center center;
  display: inline-block;
  vertical-align: middle;
  padding-left: 8px;
  width: 42px;
  height: 42px;
}
.g-signin span.text {
  display: inline-block;
  vertical-align: middle;
  padding-left: 24px;
  padding-right: 24px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
}
</style>
