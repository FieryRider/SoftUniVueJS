<template>
  <div class="movie-card">
    <section class="movie-card__profile-picture">
      <router-link :to="'/movies/' + movieId">
        <img :src="posterUrl" :alt="posterUrlAlt" />
      </router-link>
    </section>
    <section class="movie-card__content">
      <div class="movie-card__title">
        <router-link :to="'/movies/' + movieId">{{ title }}</router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: {
    title: String,
    posterUrl: String,
    movieId: String
  },
  computed: {
    posterUrlAlt: function() {
      return `Alt for ${this.title}'s poster`
    }
  }
}
</script>

<style scoped>
h5 {
  padding: 0;
  margin: 0;
}
.movie-card {
  position: relative;
  width: 130px;
  height: 240px;
  background-color: #fff;
  border: none;
  border-radius: 6px;
  overflow: hidden;
}
.movie-card img {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.movie-card__profile-picture {
  height: 195px;
}
.movie-card__title {
  margin: 0;
  padding: 0;
}
.movie-card__title a {
  font-size: 14px;
  text-decoration: none;
  color: #000;
}
.movie-card__title a:hover {
  color: #6666ff;
}
</style>
