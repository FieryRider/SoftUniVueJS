<template>
  <div class="movie-card">
    <i class="fas fa-ellipsis-v"></i>
    <section class="movie-card__poster">
      <router-link :to="'/movie/' + movieId">
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
            <a @click="addToFavourite">Favourite</a>
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
        <router-link :to="'/movie/' + movieId">{{ title }}</router-link>
        </h3>
      <div class="movie-card__release-date"><time>{{ releaseDateString }}</time></div>
    </section>
    <PercentageCircle :percentage="rating" top="245px" left="10px" textColor="#fff" fillColor="#000"/>
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
      showMenu: false,
    }
  },
  props: {
    color: String,
    title: String,
    releaseDate: Date,
    rating: Number,
    posterUrl: String,
    movieId: String
  },
  computed: {
    isUserLogged: function() {
      if (this.$store.getters.getUserToken == null)
        return false

      return true
    },
    releaseDateString: function() {
      return this.releaseDate.toLocaleString("en-US", { year: 'numeric', month: 'short', day: 'numeric', timeZone: "UTC" })
    },
    posterAlt: function() {
      return `Poster image for ${this.title}`
    }
  },
  methods: {
    addToWatchList: function() {
      console.log('wl')
    },
    addToFavourite: function() {
      console.log('fav')
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
