<template>
  <main class="movie-grid">
    <MovieCard v-for="movie in movies" :key="movie.movieId" color="white" :title="movie.title" :releaseDate="movie.releaseDate" :rating="movie.rating" :posterUrl="movie.posterUrl" :favourite="movie.favourite" :movieId="movie.movieId" />
    <Spinner class="spinner"
      v-if="isLoading"/>
  </main>
</template>

<script>
import MovieCard from "@/components/MovieCard.vue"
import Spinner from "@/components/Spinner.vue"
import { getFavouriteMoviesRequest } from "@/service/movie_management.js"

export default {
  components: {
    MovieCard,
    Spinner
  },
  data: () => {
    return {
      movies: [],
      isLoading: true
    }
  },
  created: function() {
    getFavouriteMoviesRequest(this.$store.getters.getUserToken)
      .then(movies => { this.movies = movies })
      .catch(err => {
        if ("respData" in err)
          return err.respData.json()
        this.restError = err
      }).then(data => {
        this.isLoading = false
        if (data !== undefined) {
          this.restError = JSON.stringify(data)
        }
      })
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
