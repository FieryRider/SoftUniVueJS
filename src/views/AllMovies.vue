<template>
  <main class="movie-grid">
    <MovieCard v-for="movie in movies" :key="movie.movieId" color="white" :title="movie.title" :releaseDate="movie.releaseDate" :rating="movie.rating" :posterUrl="movie.posterUrl" :favourite="movie.favourite" :popular="movie.popular" :movieId="movie.movieId" />
  </main>
</template>

<script>
import MovieCard from "@/components/MovieCard.vue";
import { getAllMoviesRequest } from "@/service/movie_management.js"

export default {
  components: {
    MovieCard
  },
  data: () => {
    return {
      movies: []
    }
  },
  computed: {
    isUserLogged: function() {
      if (this.$store.getters.getUserToken == null)
        return false

      return true
    },
  },
  created: function() {
    if (this.isUserLogged)
      getAllMoviesRequest(this.$store.getters.getUserToken)
        .then(movies => this.movies = movies)
    else
      getAllMoviesRequest()
        .then(movies => this.movies = movies)
  }
};
</script>

<style scoped>
.movie-grid {
  display: grid;
  grid-template: 1fr 1fr / repeat(5, 180px);
  grid-gap: 40px 40px;
  margin: 30px 30px 30px 400px;
}
</style>
