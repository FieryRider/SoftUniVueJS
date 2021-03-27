<template>
  <header>
    <div class="o-content-wrapper">
      <a href="/" class="logo">
          <img src="@/assets/logo.svg" alt="" />
        </a>
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

<style>
header {
  background-color: #032541;
}
.o-content-wrapper {
  background-color: #032541;
  width: 1250px;
  margin: 0 auto;
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
