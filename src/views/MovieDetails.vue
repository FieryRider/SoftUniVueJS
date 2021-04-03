<template>
  <main>
    <section class="movie-info-header">
      <section class="o-content-wrapper">
        <section class="movie-info-header__poster">
          <img :src="posterUrl" alt="">
        </section>
        <section class="movie-info-header__info">
          <h1>{{ title }}<span class="release-date">({{ releaseDate ? releaseDate.getFullYear() : '' }})</span></h1>
          <div class="movie-info-header__general-info">
            <div class="movie-info-header__certification">{{ certification }}</div>
            <div class="movie-info-header__release-date">{{ releaseDateString }}</div>
            <div class="movie-info-header__genres">{{ genresString }}</div>
            <div class="movie-info-header__runtime">{{ runtimeFormatted }}</div>
          </div>
          <div class="movie-info-header__score-buttons">
            <PercentageCircle :percentage="score" :scale="0.25" textColor="#fff" fillColor="#000"/>
            <span class="movie-info-header__user-score-text">User Score</span>
          </div>
          <div class="movie-info-header__overview">
            <h3>Overview</h3>
            <p>{{ overview }}</p>
          </div>
        </section>
      </section>
    </section>
    <section class="movie-info-cast-more">
      <div class="o-content-wrapper">
        <div>
          <h3>Top Billed Cast</h3>
          <div class="movie-info-card-more__cast-people">
            <div class="flex-scroll">
              <SmallPersonCard v-for="person in cast" :key="person.personId" :name="person.name" role="Raya (voice)" :profilePictureUrl="person.profilePictureUrl" :personId="person.personId" />
              <!-- <SmallPersonCard name="Kelly Marie Tran" role="Raya (voice)" profilePictureUrl="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/v2daUrk7hZryH6vtCWK9ESf6gAG.jpg" personId="asdad3qrq3we" /> -->
            </div>
          </div>
        </div>
        <section class="movie-info-cast-more__info">
          <div>
            <h5>Status</h5>
            <span>{{ statusString }}</span>
          </div>
          <div>
            <h5>Original Language</h5>
            <span>{{ originalLanguage }}</span>
          </div>
          <div>
            <h5>Budget</h5>
            <span>{{ budget }}</span>
          </div>
          <div>
            <h5>Revenue</h5>
            <span>{{ revenueString }}</span>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script>
import moment from  "moment"
import PercentageCircle from "@/components/PercentageCircle.vue"
import SmallPersonCard from "@/components/SmallPersonCard.vue"

export default {
  components: {
    PercentageCircle,
    SmallPersonCard
  },
  data: () => {
    return {
      title: "",
      releaseDate: null,
      releaseCountry: "",
      genres: [],
      runtime: null,
      certification: "",
      score: 0,
      tagLine: "",
      overview: "",
      status: "",
      originalLanguage: "",
      budget: 0,
      revenue: 0,
      posterUrl: "",
      cast: []
    }
  },
  computed: {
    releaseDateString: function() {
      if (this.releaseDate === null)
        return ""
      return `${this.releaseDate.getMonth() + 1}/${this.releaseDate.getDate()}/${this.releaseDate.getFullYear()} (${this.releaseCountry})`
    },
    genresString: function() {
      const formattedGenres = this.genres.map(genre => {
        return genre.split("_").map(word => word[0].toUpperCase() + word.substring(1)).join(" ")
      })
      return formattedGenres.join(", ")
    },
    runtimeFormatted: function() {
      if (this.runtime === null)
        return ""
      return `${this.runtime.hours()}h ${this.runtime.minutes()}m`
    },
    statusString: function() {
      return this.status.split("_").map(word => word[0].toUpperCase() + word.substring(1)).join(" ")
    },
    revenueString: function() {
      return this.revenue ? this.revenue : "-"
    }
  },
  created: function() {
    fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/movies/${this.$route.params.movieId}?loadRelations=genres,cast`)
      .then(resp => resp.json())
      .then(data => {
        this.title = data.title
        this.releaseDate = new Date(data.release_date)
        // this.releaseCountry = data.release_country
        this.releaseCountry = "US"
        this.genres = data.genres.map(genreObj => genreObj.name)
        this.runtime = moment.duration(113, "minutes")
        // this.certification = data.certification
        this.certification = "PG-13"
        this.score = data.rating
        // this.tagLine = data.tag_line
        this.overview = data.overview
        this.status = data.status
        this.originalLanguage = data.official_language
        this.budget = data.budget
        this.revenue = data.revenue
        this.posterUrl = data.poster_url
        this.cast = data.cast.map(actor => { return { 'name': actor.name, 'profilePictureUrl': actor.profile_picture_url, 'personId': actor.objectId } })
      })
  }
}
</script>

<style scoped>
h5 {
  margin-bottom: 2px;
  padding: 0;
  font-size: 0.9rem;
  font-weight: 600;
}
.container {
  display: flex;
  overflow: auto;
}
.movie-info-header {
  background-color: #333;
  color: #fff;
}
.movie-info-header .o-content-wrapper {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-column-gap: 40px;
}
.movie-info-header__poster {
  display: grid;
}
.movie-info-header__poster img {
  width: 300px;
  height: 450px;
  align-self: center;
  margin: 20px 0;
  border: none;
  border-radius: 10px;
  overflow: hidden;
}
.release-date {
  opacity: 0.8;
  font-weight: 400;
  margin-left: 10px;
}
.movie-info-header__general-info {
  display: flex;
  flex-flow: row nowrap;
}
.movie-info-header__general-info div {
  margin: 0 5px;
}
.movie-info-header__general-info div:first-child {
  margin-left: 0;
}
.movie-info-header__general-info div:last-child {
  margin-right: 0;
}
.movie-info-header__certification {
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 3px;
  transform: translateY(-5px)
}
.movie-info-header__score-buttons {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 10px 0;
}
.movie-info-header__user-score-text {
  font-weight: bold;
  width: 10px;
  line-height: 1.3rem;
}
.movie-info-header__overview p {
  font-size: 0.9rem;
}
.movie-info-cast-more .o-content-wrapper {
  display: grid;
  grid-template-columns: 970px 260px;
  grid-gap: 20px;
}
.movie-info-card-more__cast-people {
  display: flex;
  overflow: auto;
}
.movie-info-cast-more__info div {
  margin: 15px 0;
}
.movie-info-cast-more__info div {
  font-size: 0.9rem;
}
.flex-scroll {
  padding: 10px 5px;
  
  display: flex;
  flex-wrap: nowrap;
}
.flex-scroll>div {
  margin: 0 5px;
}

</style>
