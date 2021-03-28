<template>
  <header>
    <div class="o-content-wrapper">
      <router-link to="/" class="logo">
          <img src="@/assets/logo.svg" alt="" />
        </router-link>
      <Navigation />
    </div>
  </header>
</template>

<script>
import Navigation from "@/components/core/Navigation.vue"

export default {
  components: {
    Navigation
  }
}
</script>

<style scoped>
header {
  background-color: #032541;
}
header .o-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  width: 154px;
  height: 20px;
  margin-right: 20px;
}
</style>
