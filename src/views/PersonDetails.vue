<template>
  <main>
    <div class="o-content-wrapper">
      <section class="general-info">
        <img :src="profilePictureUrl" alt="">
        <h3>Personal Info</h3>
        <div>
          <h5>Known For</h5>
          <p>{{ knownFor }}</p>
        </div>
        <div>
          <h5>Known Credits</h5>
          <p>{{ knownCredits }}</p>
        </div>
        <div>
          <h5>Gender</h5>
          <p>{{ gender }}</p>
        </div>
        <div>
          <h5>Birthday</h5>
          <p>{{ birthdayString }}</p>
        </div>
        <div>
          <h5>Place of Birth</h5>
          <p>{{ placeOfBirth }}</p>
        </div>
      </section>
      <section class="main-info">
        <h1>{{ name }}</h1>
        <section class="main-info__biography">
          <h3>Biography</h3>
          <p>{{ biography }}</p>
        </section>
        <section class="main-info__known-for">
          <div>
            <h3>Known for</h3>
            <div class="main-info__known-for-movies">
              <div class="flex-scroll">
                <SmallMovieCard v-for="movie in knownForList" :key="movie.movieId" :title="movie.title" :posterUrl="movie.posterUrl" :movieId="movie.movieId" />
              </div>
            </div>
          </div>
        </section>
        <section class="main-info__acting">
        </section>
        <section class="main-info__production">
        </section>
        <section class="main-info__writing">
        </section>
        <section class="main-info__directing">
        </section>
      </section>
    </div>
  </main>
</template>

<script>
import SmallMovieCard from "@/components/SmallMovieCard.vue"

export default {
  components: {
    SmallMovieCard
  },
  data: () => {
    return {
      name: "",
      gender: "",
      age: 0,
      birthday: null,
      placeOfBirth: "",
      biography: "",
      profilePictureUrl: "",
      knownFor: "Acting",
      knownForList: [],
      knownCredits: 0
    }
  },
  computed: {
    birthdayString: function() {
      if (this.birthday === null)
        return ""
      return `${this.birthday.getFullYear()}-${this.birthday.getMonth() + 1}-${this.birthday.getDate()} (${this.age})`
    },
  },
  created: function() {
    fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/actors/${this.$route.params.personId}?loadRelations=known_for`)
      .then(resp => resp.json())
      .then(data => {
        this.name = data.name
        this.gender = data.gender
        this.age = data.age
        this.birthday = new Date(data.birthday)
        this.placeOfBirth = data.place_of_birth
        //this.biography = data.biography
        this.biography = "An English actress. In 2003, Hall won the Ian Charleson Award for her debut stage performance in a production of Mrs. Warren's Profession. She has appeared in three high-profile films: The Prestige, Vicky Cristina Barcelona (for which she was nominated for a Golden Globe in the Best Actress in a Motion Picture – Musical or Comedy category), and The Town. On 6 June 2010, she won the Supporting Actress BAFTA for her portrayal of Paula Garland in the 2009 Channel 4 production Red Riding: In the Year of Our Lord 1974.\
        Description above from the Wikipedia article Rebecca Hall, licensed under CC-BY-SA, full list of contributors on Wikipedia."
        this.profilePictureUrl = data.profile_picture_url

        this.knownForList = data.known_for.map(movie => {
          return {
            posterUrl: movie.poster_url,
            title: movie.title,
            movieId: movie.objectId
          }
        })
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
.general-info div {
  margin: 15px 0;
  font-size: 0.9rem;
}
.general-info h3 {
  margin: 0;
  padding: 0;
}
.general-info p {
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  overflow: auto;
}
.o-content-wrapper {
  display: grid;
  grid-template-columns: 300px 1000px;
  grid-column-gap: 40px;
}
.general-info img {
  width: 300px;
  height: 450px;
  align-self: center;
  margin: 20px 0;
  border: none;
  border-radius: 10px;
  overflow: hidden;
}
.main-info h3 {
  margin-bottom: 20px;
}
.main-info__biography p {
  font-size: 1rem;
  line-height: 22px;
}
.main-info__known-for-movies {
  display: flex;
  overflow: auto;
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
