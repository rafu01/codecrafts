<template>
  <!-- <img alt="Vue logo" class="logo" src="./assets/logo.png">
  <HomePage/> -->
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// import HomePage from './components/HomePage.vue'
require('@/assets/main.scss');
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
