<template>
  <form action="/movies/add" @submit.prevent="handleAddMovie">
    <div class="error"
      v-if="restError"
      @click="restError = ''"
    >
      {{ restError }}
    </div>
    <div class="message"
      v-if="infoMessage"
      @click="infoMessage = ''"
    >
      {{ infoMessage }}
    </div>
    <section class="form-field">
      <label for="input-title">Title</label>
      <input type="text" id="input-title" name="title" 
        v-model.lazy.trim="$v.formData.title.$model"
        :class="{ 'bg-danger': $v.formData.title.$error }">
      <div class="error" 
        v-if="$v.formData.title.$error">
        <p v-if="!$v.formData.title.required">Title cannot be empty</p>
        <p v-if="!$v.formData.title.titleValidator">Title must contain only letters and numbers</p>
      </div>
    </section>

    <section class="form-field">
      <label for="input-gender">Status </label>
      <select name="status" id="input-status"
        v-model="$v.formData.status.$model">
        <option value="released">Released</option>
        <option value="in_production">In Production</option>
      </select>
      <div class="error" 
        v-if="$v.formData.status.$error">
        <p v-if="!$v.formData.status.required">You must select status</p>
      </div>
    </section>

    <section class="form-field">
      <label for="input-overview">Overview</label>
      <input type="text" id="input-overview" name="overview" 
        v-model.lazy.trim="$v.formData.overview.$model"
        :class="{ 'bg-danger': $v.formData.overview.$error }">
      <div class="error" 
        v-if="$v.formData.overview.$error">
        <p v-if="!$v.formData.overview.required">Overview cannot be empty</p>
      </div>
    </section>

    <section class="form-field">
      <label for="input-budget">Budget</label>
      <input type="number" id="input-budget" name="budget" 
        v-model.lazy.trim="$v.formData.budget.$model"
        :class="{ 'bg-danger': $v.formData.budget.$error }">
      <div class="error" 
        v-if="$v.formData.budget.$error">
        <p v-if="!$v.formData.budget.required">Budget cannot be empty</p>
      </div>
      </section>

    <section class="form-field">
      <label for="input-revenue">Revenue</label>
      <input type="number" id="input-revenue" name="revenue" 
        v-model.lazy.trim="$v.formData.revenue.$model"
        :class="{ 'bg-danger': $v.formData.revenue.$error }">
      </section>

    <section class="form-field">
      <label for="input-release-date">Release Date</label>
      <input type="date" id="input-release-date" name="releaseDate" 
        v-model.lazy.trim="$v.formData.releaseDate.$model"
        :class="{ 'bg-danger': $v.formData.releaseDate.$error }">
      <div class="error" 
        v-if="$v.formData.releaseDate.$error">
        <p v-if="!$v.formData.releaseDate.required">Release date cannot be empty</p>
      </div>
      </section>

    <section class="form-field">
      <label for="input-rating">Rating</label>
      <input type="number" id="input-rating" name="rating" 
        v-model.lazy.trim="$v.formData.rating.$model"
        :class="{ 'bg-danger': $v.formData.rating.$error }">
      </section>

    <section class="form-field">
      <label for="input-official-language">Official language</label>
      <input type="text" id="input-official-language" name="officialLanguage" 
        v-model.lazy.trim="$v.formData.officialLanguage.$model"
        :class="{ 'bg-danger': $v.formData.officialLanguage.$error }">
      <div class="error" 
        v-if="$v.formData.officialLanguage.$error">
        <p v-if="!$v.formData.officialLanguage.required">Official language cannot be empty</p>
      </div>
    </section>

    <section class="form-field">
      <label for="input-poster-url">Poster URL</label>
      <input type="text" id="input-poster-url" name="posterUrl" 
        v-model.lazy.trim="$v.formData.posterUrl.$model"
        :class="{ 'bg-danger': $v.formData.posterUrl.$error }">
      <div class="error" 
        v-if="$v.formData.posterUrl.$error">
        <p v-if="!$v.formData.posterUrl.required">Poster URL cannot be empty</p>
        <p v-if="!$v.formData.posterUrl.url">Poster URL has to be valid</p>
      </div>
    </section>

    <section class="form-field">
      <label class="select-label" for="input-actors">Actors:</label>
      <select name="actors" id="input-actors" multiple v-model="formData.selectedActors">
        <option v-for="actor in actors" :value="actor" :key="actor.actorId">
          {{ actor.name }}
        </option>
      </select>
    </section>

    <section class="form-field">
      <label class="select-label" for="input-genres">Genres:</label>
      <select name="genres" id="input-genres" multiple v-model="formData.selectedGenres">
        <option v-for="genre in genres" :value="genre" :key="genre.genreId">
          {{ genre.name }}
        </option>
      </select>
    </section>

    <input type="submit" value="Add Movie">
    <input type="button" value="Cancel" 
      @click="handleClear">
      <Spinner class="spinner" 
        v-if="isLoading"/>
  </form> 
</template>

<script>
import Spinner from "@/components/Spinner.vue"
import { required, alpha, numeric, url } from "vuelidate/lib/validators"

const titleValidator = (value) => {
  if (value.trim().length === 0)
    return true  // Caught by `required` validator
  const nameRegex = /^[a-zA-Z0-9'!#$%()\s-]+$/g
  return value.match(nameRegex) != null
}

export default {
  components: {
    Spinner
  },
  created: function() {
    const actorsRequst = fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/actors")
    const genresRequest = fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/genres")
    Promise.all([actorsRequst, genresRequest])
      .then(resp => Promise.all(resp.map(r => r.json())))
      .then(([actors, genres]) => {
        this.actors = actors
        this.genres = genres
      })
      
  },
  data: () => {
    return {
      isLoading: false,
      restError: "",
      infoMessage: "",
      genres: [],
      actors: [],
      formData: {
        title: "",
        status: "",
        overview: "",
        budget: 0,
        revenue: null,
        releaseDate: undefined,
        rating: 0,
        posterUrl: "",
        officialLanguage: "",
        selectedGenres: [],
        selectedActors: []
      }
    }
  },
  validations: {
    formData: {
      title: { 
        required,
        titleValidator
      },
      status: { 
        required,
      },
      overview: { 
        required
      },
      rating: {
        numeric
      },
      budget: { 
        required,
        numeric
      },
      revenue: {
        numeric
      },
      releaseDate: {
        required
      },
      posterUrl: {
        required,
        url
      },
      officialLanguage: {
        required,
        alpha
      },
      selectedActors: {
      },
      selectedGenres: {
      }
    }
  },
  methods: {
    handleAddMovie: function() {
      this.isLoading = true
      this.$v.$touch()
      const { formData } =  this.$v
      if (formData.$anyError || !formData.$dirty) {
        this.isLoading = false
        return
      }

      let addedMovieId
      fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/movies", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'user-token': this.$store.getters.getUserToken
        },
        body: JSON.stringify({
          'title': formData.title.$model,
          'status': formData.status.$model,
          'overview': formData.overview.$model,
          'rating': parseInt(formData.rating.$model),
          'budget': parseFloat(formData.budget.$model),
          'revenue': parseFloat(formData.revenue.$model),
          'release_date': formData.releaseDate.$model,
          'poster_url': formData.posterUrl.$model,
          'official_language': formData.officialLanguage.$model,
        })
      }).then(resp => {
        if (!resp.ok)
          this.restError = `Server returned ${resp.status}: ${resp.statusText}`
        return resp.json()
      }).then(movie => {
        addedMovieId = movie.objectId
        const cast = formData.selectedActors.$model.map(actor => actor.objectId)
        return fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/movies/${addedMovieId}/cast`, {
          method: "POST",
          headers: {
            'Content-Type': "application/json",
            'user-token': this.$store.getters.getUserToken
          },
          body: JSON.stringify(cast)
        })
      }).then(resp => {
        if (!resp.ok)
          this.restError = `Server returned ${resp.status}: ${resp.statusText}`

        const genres = formData.selectedGenres.$model.map(genre => genre.objectId)
        return fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/movies/${addedMovieId}/genres`, {
          method: "POST",
          headers: {
            'Content-Type': "application/json",
            'user-token': this.$store.getters.getUserToken
          },
          body: JSON.stringify(genres)
        }) 
      }).then(resp => {
        this.isLoading = false
        if (!resp.ok) {
          this.restError = `Server returned ${resp.status}: ${resp.statusText}`
        } else {
          this.infoMessage = "Movie added successfully"
        }
      }).catch(err => {
        this.isLoading = false
        this.restError = err
      })
    },
    handleClear: function() {
      this.formData.title = ""
      this.formData.status = ""
      this.formData.overview = ""
      this.formData.budget = 0
      this.formData.revenue = null
      this.formData.releaseDate = undefined
      this.formData.rating = 0
      this.formData.posterUrl = ""
      this.formData.officialLanguage = ""
    }
  }
}
</script>

<style scoped>
input[type='text'],
input[type='number'],
input[type='date'] {
  width: 100%;
  margin: 4px 0 8px 0;
  padding: 4px 16px;
  border-color: #ced4da;
  border-radius: .25rem;
  border-width: 1px;
  border-style: solid;
  line-height: 2;
  color: #555;
}
input[type='text']:focus,
input[type='number']:focus,
input[type='date']:focus {
  border-color: rgba(150, 150, 150, 0.8);
  box-shadow: 0 1px 1px rgba(150, 150, 150, 0.075) inset, 0 0 8px rgba(150, 150, 150, 0.6);
  outline: 0 none;
}
input[type='submit'] {
  margin: 5px;
  padding: 8px 20px;
  border: none;
  border-radius: 10px;
  background-color: #032541;
  color: #fff;
  font-weight: bold;
  box-shadow: none;
  transition-duration: 0.18s;
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
input[type='submit']:hover {
  background-color: rgba(3, 36, 63, 0.90);
  cursor: pointer;
}
input[type='button'] {
  margin: 5px;
  padding: 8px 20px;
  border: 1px solid rgba(3, 36, 63, 0.81);
  border-radius: 10px;
  background-color: #fff;
  color: #000;
  box-shadow: none;
  transition-duration: 0.18s;
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
input[type='button']:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);
}
select {
  min-width: 200px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background-color: #fff;
  scrollbar-width: thin;
}
select option {
  padding: 5px;
  border-radius: 3px;
}

.select-label {
  margin-right: 10px;
  vertical-align: top;
}
.radio-label {
  margin-left: 4px;
  margin-right: 8px;
}
.form-field {
  margin: 10px 0;
}
.spinner {
  margin: 0 15px;
}
</style>
