<template>
  <div class="movie-card">
    <i class="fas fa-ellipsis-v"></i>
    <section class="movie-card__poster">
      <router-link :to="'/movies/' + movieId">
        <img :src="posterUrl" :alt="posterAlt" />
      </router-link>
      <div class="movie-card__options">
        <a class="movie-card__options-button" @click="showMenu = !showMenu">
          <font-awesome-icon :icon="['fa', 'ellipsis-v']" :color="buttonColor" :mask="['fa', 'circle']" size="lg" transform="shrink-6 rotate-90" @mouseover="buttonColor = '#01B4FF'" @mouseout="buttonColor = 'white'"/>
        </a>
        <section class="movie-card__options-content movie-card__options-content--logged" v-if="isUserLogged" v-show="showMenu">
          <section>
            <a @click="addToWatchList">Watch List</a>
          </section>
          <section>
            <a v-if="isFavourite" @click="removeFromFavourites">Remove Favourite</a>
            <a v-else @click="addToFavourites">Favourite</a>
          </section>
          <section v-if="isUserLogged && isUserAdmin">
            <a v-if="isPopular" @click="removeFromPopular">Remove from Popular</a>
            <a v-else @click="addToPopular">Add to Popular</a>
          </section>
        </section>
        <section class="movie-card__options-content movie-card__options-content--guest" v-else v-show="showMenu">
            <section>
              <h5>Want to add item to a list?</h5>
              <router-link to="/login">Login</router-link>
            </section>
            <section>
              <h5>Not a member?</h5>
              <router-link to="/register">Register</router-link>
            </section>
        </section>
      </div>
    </section>
    <section class="movie-card__content">
      <h3 class="movie-card__title">
        <router-link :to="'/movies/' + movieId">{{ title }}</router-link>
        </h3>
      <div class="movie-card__release-date"><time>{{ releaseDateString }}</time></div>
    </section>
    <PercentageCircle :percentage="rating" top="245px" left="10px" textColor="#fff" fillColor="#000" :positionAbsolute="true" />
  </div>
</template>

<script>
import PercentageCircle from "@/components/PercentageCircle.vue"

export default {
  components: {
    PercentageCircle
  },
  data() {
    return {
      buttonColor: this.color,
      showMenu: false
    }
  },
  props: {
    color: String,
    title: String,
    releaseDate: Date,
    rating: Number,
    posterUrl: String,
    movieId: String,
    favourite: Boolean,
    popular: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isUserLogged: function() {
      if (this.$store.getters.getUserToken == null)
        return false

      return true
    },
    isUserAdmin: function() {
      return this.$store.getters.getIsAdmin
    },
    releaseDateString: function() {
      return this.releaseDate.toLocaleString("en-US", { year: 'numeric', month: 'short', day: 'numeric', timeZone: "UTC" })
    },
    posterAlt: function() {
      return `Poster image for ${this.title}`
    },
    isFavourite:  {
      get: function() {
        return this.favourite
      },
      set: function(value) {
        this.favourite = value
      }
    },
    isPopular:  {
      get: function() {
        return this.popular
      },
      set: function(value) {
        this.popular = value
      }
    }
  },
  mounted: function() {
    document.addEventListener('click', this.close)
  },
  methods: {
    addToWatchList: function() {
      console.log(this.$store.getters.getUserToken)
    },
    addToFavourites: function() {
      fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/favourite_movies", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'user-token': this.$store.getters.getUserToken
        },
        body: JSON.stringify({})
      }).then(resp => resp.json())
        .then(data => {
          const favouriteMovieEntryId = data.objectId
          if (favouriteMovieEntryId == undefined)
            return

          fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/favourite_movies/${favouriteMovieEntryId}/movie`, {
            method: "POST",
            headers: {
              'Content-Type': "application/json",
              'user-token': this.$store.getters.getUserToken
            },
            body: JSON.stringify([this.movieId])
          }).then(resp => {
            if (!resp.ok && resp.status >= 500)
              throw new Error({ 'status': resp.status, 'statusText': resp.statusText })
            else if (!resp.ok && resp.status < 500)
              return Promise.reject({ respData: resp })

            return resp.json()
          }).then(() => {
            this.isFavourite = true
          }).catch(err => {
            if ("respData" in err)
              return err.respData.json()
          }).then(data => {
            if (data !== undefined)
              console.warn("DbError", data)
          })
        })
    },
    removeFromFavourites: function() {
      let favMovieId
      fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/favourite_movies?loadRelations=movie", {
        headers: {
          'Conten-Type': "application/json",
          'user-token': this.$store.getters.getUserToken
        }
      }).then(resp => resp.json())
        .then(data => {
          data.forEach(favMovie => {
            if (favMovie.movie.objectId == this.movieId)
              favMovieId = favMovie.objectId
          })

          if (favMovieId != undefined) {
            return fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/favourite_movies/${favMovieId}/movie`, {
              method: "DELETE",
              headers: {
                'Content-Type': "application/json",
                'user-token': this.$store.getters.getUserToken
              }
            })
          } else {
            throw new Error("fanMovieId isundefined")
          }
        })
        .then(resp => resp.json())
        .then(() => {
          return fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/favourite_movies/${favMovieId}`, {
            method: "DELETE",
            headers: {
              'Content-Type': "application/json",
              'user-token': this.$store.getters.getUserToken
            }
          })
        })
        .then(resp => resp.json())
        .then(() => {
          this.isFavourite = false
        })
        .catch(e => console.error(e))

    },
    addToPopular: function() {
      fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/popular_movies", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'user-token': this.$store.getters.getUserToken
        },
        body: JSON.stringify({})
      }).then(resp => resp.json())
        .then(data => {
          const popularMovieEntryId = data.objectId
          if (popularMovieEntryId == undefined)
            return

          fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/popular_movies/${popularMovieEntryId}/movie`, {
            method: "POST",
            headers: {
              'Content-Type': "application/json",
              'user-token': this.$store.getters.getUserToken
            },
            body: JSON.stringify([this.movieId])
          }).then(resp => {
            if (!resp.ok && resp.status >= 500)
              throw new Error({ 'status': resp.status, 'statusText': resp.statusText })
            else if (!resp.ok && resp.status < 500)
              return Promise.reject({ respData: resp })

            return resp.json()
          }).then(() => {
            this.isPopular = true
          }).catch(err => {
            if ("respData" in err)
              return err.respData.json()

            console.error(err)
          }).then(data => {
            if (data !== undefined)
              console.warn("DbError", data)
          })
        })
    },
    removeFromPopular: function() {
      let popularMovieId
      fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/popular_movies?loadRelations=movie", {
        headers: {
          'Conten-Type': "application/json",
          'user-token': this.$store.getters.getUserToken
        }
      }).then(resp => resp.json())
        .then(data => {
          data.forEach(popularMovie => {
            if (popularMovie.movie.objectId == this.movieId)
              popularMovieId = popularMovie.objectId
          })

          if (popularMovieId != undefined) {
            return fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/popular_movies/${popularMovieId}/movie`, {
              method: "DELETE",
              headers: {
                'Content-Type': "application/json",
                'user-token': this.$store.getters.getUserToken
              }
            })
          } else {
            throw new Error("popularMovieId isundefined")
          }
        })
        .then(resp => resp.json())
        .then(() => {
          return fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/popular_movies/${popularMovieId}`, {
            method: "DELETE",
            headers: {
              'Content-Type': "application/json",
              'user-token': this.$store.getters.getUserToken
            }
          })
        })
        .then(resp => resp.json())
        .then(() => {
          this.isPopular = false
        })
        .catch(e => console.error(e))

    },
    close: function(e) {
      if (!this.$el.contains(e.target))
        this.showMenu = false
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
  width: 180px;
  height: 384px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 4px 4px 10px 4px rgba(0,0,0,0.1);
}
.movie-card img {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.movie-card__poster {
  height: 270px;
}
.movie-card__title {
  margin: 0;
  padding: 0;
}
.movie-card__title a {
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  color: #000;
}
.movie-card__title a:hover {
  color: #6666ff;
}

.movie-card__release-date {
  font-size: 16px;
  color: rgba(0,0,0,0.6)
}
.movie-card__content {
  padding: 26px 10px 12px 10px;
}
.movie-card__options {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 4;
}
.movie-card__options-button {
  opacity: 0.6;
}
.movie-card__options-button:hover {
  cursor: pointer;
}
.movie-card__options-content {
  position: absolute;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  left: 0;
  top: 30px;
  transform: translateX(-40%);
  background-color: #fff;
  border: none;
  border-radius: 5px;
  border: 1px solid rgba(0,0,0,0.15);
}
.movie-card__options-content--logged {
  width: 120px;
}
.movie-card__options-content--guest {
  width: 270px;
}
.movie-card__options-content--guest section {
  padding: 10px 20px;
}
.movie-card__options-content--logged section {
  padding: 5px 10px;
}
.movie-card__options-content--guest * {
  padding: 6px 0;
}
.movie-card__options-content--logged * {
  padding: 9px 0;
}
.movie-card__options-content section:first-child {
  border-bottom: 1px solid rgba(0,0,0,0.2);
}
.movie-card__options-content a {
  color: rgba(0, 0, 0, 0.5);
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition-duration: 0.28s;
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.movie-card__options-content a:hover {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.7);
}
</style>
