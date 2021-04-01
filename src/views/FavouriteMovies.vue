<template>
  <main class="movie-grid">
    <MovieCard v-for="movie in movies" :key="movie.movieId" color="white" :title="movie.title" :releaseDate="movie.releaseDate" :rating="movie.rating" :posterUrl="movie.posterUrl" :favourite="movie.favourite" :movieId="movie.movieId" />
  </main>
</template>

<script>
import MovieCard from "@/components/MovieCard.vue";

export default {
  components: {
    MovieCard
  },
  data: () => {
    return {
      movies: []
    }
  },
  created: function() {
    fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/favourite_movies?relationsDepth=2", {
      headers: {
        'Conten-Type': "application/json",
        'user-token': this.$store.getters.getUserToken
      }
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        data.forEach(dbFavMovie => {
          const dbMovie = dbFavMovie.movie
          const movie = {
            'title': dbMovie.title,
            'releaseDate': new Date(dbMovie['release_date']),
            'rating': dbMovie.rating,
            'posterUrl': dbMovie['poster_url'],
            'overview': dbMovie.overview,
            'officialLanguage': dbMovie['official_language'],
            'budget': dbMovie.budget,
            'revenue': dbMovie.revenue,
            'status': dbMovie.status,
            'movieId': dbMovie.objectId,
            'favourite': true
          }

          this.movies.push(movie)
        })
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
