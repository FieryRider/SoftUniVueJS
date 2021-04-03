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
    <FormInput type="text" label="Title" name="title" v-model="formData.title" :v="$v.formData.title" :errorMessages="errorMessages.title" />

    <section class="form-field">
      <label for="input-status">Status </label>
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

    <FormInput type="text" label="Overview" name="overview" v-model="formData.overview" :v="$v.formData.overview" :errorMessages="errorMessages.overview" />

    <FormInput type="number" label="Budget" name="budget" v-model="formData.budget" :v="$v.formData.budget" :errorMessages="errorMessages.budget" />

    <FormInput type="number" label="Revenue" name="revenue" v-model="formData.revenue" :v="$v.formData.revenue" :errorMessages="errorMessages.revenue" />

    <FormInput type="date" label="Release Date" name="releaseDate" v-model="formData.releaseDate" :v="$v.formData.releaseDate" :errorMessages="errorMessages.releaseDate" />

    <FormInput type="number" label="Rating" name="rating" v-model="formData.rating" :v="$v.formData.rating" :errorMessages="errorMessages.rating" />

    <FormInput type="text" label="Official Language" name="officialLanguage" v-model="formData.officialLanguage" :v="$v.formData.officialLanguage" :errorMessages="errorMessages.officialLanguage" />

    <FormInput type="text" label="Poster URL" name="posterUrl" v-model="formData.posterUrl" :v="$v.formData.posterUrl" :errorMessages="errorMessages.posterUrl" />

    <FormInput type="multipleSelect" label="Actors" name="actors" :options="actors"  v-model="formData.selectedActors" :v="$v.formData.selectedActors" :errorMessages="errorMessages.selectedActors" />

    <FormInput type="multipleSelect" label="Genres" name="genres" :options="genres" v-model="formData.selectedGenres" :v="$v.formData.selectedGenres" :errorMessages="errorMessages.selectedGenres" />

    <input type="submit" value="Add Movie">
    <input type="button" value="Cancel" 
      @click="handleClear">
      <Spinner class="spinner" 
        v-if="isLoading"/>
  </form> 
</template>

<script>
import Spinner from "@/components/Spinner.vue"
import FormInput from "@/components/FormInput.vue"
import { required, alpha, numeric, url } from "vuelidate/lib/validators"
import { addMovieRequest } from "@/service/movie_management.js"

const titleValidator = (value) => {
  if (value.trim().length === 0)
    return true  // Caught by `required` validator
  const nameRegex = /^[a-zA-Z0-9'!#$%()\s-]+$/g
  return value.match(nameRegex) != null
}

export default {
  components: {
    FormInput,
    Spinner
  },
  created: function() {
    this.errorMessages = {
      title: {
        required: "Title cannot be empty",
        titleValidator: "Title must contain only letters and numbers"
      },
      status: {
        required: "You must select status"
      },
      overview: {
        required: "Overview cannot be empty"
      },
      budget: {
        required: "Budget cannot be empty"
      },
      revenue: {
      },
      releaseDate: {
        required: "Release date cannot be empty"
      },
      rating: {
      },
      officialLanguage: {
        required: "Official language cannot be empty"
      },
      posterUrl: {
        required: "Poster URL cannot be empty",
        url: "Poster URL has to be valid"
      },
      selectedActors: {
      },
      selectedGenres: {
      }
    }

    const actorsRequst = fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/actors?pageSize=100")
    const genresRequest = fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/genres?pageSize=100")
    Promise.all([actorsRequst, genresRequest])
      .then(resp => Promise.all(resp.map(r => r.json())))
      .then(([actors, genres]) => {
        this.actors = actors.map(actor => {
          return {
            objectId: actor.objectId,
            value: actor,
            text: actor.name
          }
        }).sort((a1, a2) => a1.text.localeCompare(a2.text))
        this.genres = genres.map(genre => {
          return {
            objectId: genre.objectId,
            value: genre,
            text: genre.name.replace("_", " ").replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substring(1).toLowerCase())
          }
        }).sort((g1, g2) => g1.text.localeCompare(g2.text))
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
      },
      errorMessages: {}
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
  computed: {
    formattedGenres: function() {
      const formattedGenres = this.genres.map(genre => {
        let words = genre.name.split("_")
        words = words.map(word => word[0].toUpperCase() + word.substring(1))
        genre.name = words.join(" ")
        return genre
      })
      return formattedGenres
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

      const movie = {
        'title': formData.title.$model,
        'status': formData.status.$model,
        'overview': formData.overview.$model,
        'rating': parseInt(formData.rating.$model),
        'budget': parseFloat(formData.budget.$model),
        'revenue': parseFloat(formData.revenue.$model),
        'release_date': formData.releaseDate.$model,
        'poster_url': formData.posterUrl.$model,
        'official_language': formData.officialLanguage.$model,
      }

      const cast = formData.selectedActors.$model.map(actor => actor.objectId)
      const genres = formData.selectedGenres.$model.map(genre => genre.objectId)

      addMovieRequest(movie, cast, genres, this.$store.getters.getUserToken).then(() => {
        this.infoMessage = "Movie added successfully"
      }).catch(err => {
        this.restError = err
      }).then(() => {
        this.isLoading = false
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
.form-field {
  margin: 10px 0;
}
.spinner {
  margin: 0 15px;
}
</style>
