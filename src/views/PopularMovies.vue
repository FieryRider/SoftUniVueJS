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
  computed: {
    isUserLogged: function() {
      if (this.$store.getters.getUserToken == null)
        return false

      return true
    },
  },
  created: function() {
    let favouriteMoviesIds = undefined
    let favouriteMoviesRequest = Promise.resolve()
    if (this.isUserLogged) {
      favouriteMoviesRequest = fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/favourite_movies?relationsDepth=1", {
        headers: {
          'Conten-Type': "application/json",
          'user-token': this.$store.getters.getUserToken
        }
      })
    }
    favouriteMoviesRequest
      .then(resp => {
        if (resp === undefined)
          return Promise.resolve()
        else
          return resp.json()
      })
      .then(data => {
        favouriteMoviesIds = null
        if (data != undefined)
          favouriteMoviesIds = data.map(favMovie => favMovie.movie.objectId)

        return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/movies")
      })
      .then(resp => resp.json())
      .then(data => {
        data.forEach(dbMovie => {
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
            'favourite': favouriteMoviesIds == null ? false : favouriteMoviesIds.includes(dbMovie.objectId)
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
