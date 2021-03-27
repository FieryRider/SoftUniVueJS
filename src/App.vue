<template>
  <div id="app">
    <Header />


  </div>
</template>

<script>
import Header from "@/components/core/Header.vue"
export default {
  name: "App",
  components: {
    Header
  }
}
</script>

<style>
@import './assets/styles/normalize.css';
* {
  font-family: 'Source Sans Pro', Arial, sans-serif;
}
</style>
