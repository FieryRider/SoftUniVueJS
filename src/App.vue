<template>
  <div id="app">
    <Header />
    <router-view />
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
.o-content-wrapper {
  width: 1250px;
  margin: 0 auto;
}
.bg-danger {
  background-color: #ff0000;
}
.error {
  color: #ff0000;
}
</style>
