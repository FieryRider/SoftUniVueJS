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
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&display=swap');
* {
  font-family: 'Source Sans Pro', Arial, sans-serif;
  box-sizing: border-box;
}
.o-content-wrapper {
  width: 1250px;
  margin: 0 auto;
}
.bg-danger {
  background-color: #ff0000;
}
.error {
  padding: 10px 10px;
  background-color: #ff0000;
  color: #fff;
  border: none;
  border-radius: 5px;
}
.error p {
  padding: 0;
  margin: 0;
}
.message {
  padding: 10px 10px;
  background-color: #1b3a53;
  color: #fff;
  border: none;
  border-radius: 5px;
}
.message p {
  padding: 0;
  margin: 0;
}
</style>
