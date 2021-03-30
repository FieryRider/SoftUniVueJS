<template>
  <form action="/actor/add" @submit.prevent="handleAddActor">
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
      <label for="input-name">Name</label>
      <input type="text" id="input-name" name="name" 
        v-model.lazy.trim="$v.formData.name.$model"
        :class="{ 'bg-danger': $v.formData.name.$error }">
      <div class="error" 
        v-if="$v.formData.name.$error">
        <p v-if="!$v.formData.name.required">Name cannot be empty</p>
        <p v-if="!$v.formData.name.nameValidator">Name must contain only letters and numbers</p>
      </div>
    </section>

    <section class="form-field">
      <label for="input-gender">Gender </label>
      <input type="radio" id="input-gender" name="gender" value="male"
        v-model="$v.formData.gender.$model"
        :class="{ 'bg-danger': $v.formData.gender.$error }">
      <label class="radio-label" for="male">Male</label>
      <input type="radio" id="input-gender" name="gender" value="female"
        v-model="$v.formData.gender.$model"
        :class="{ 'bg-danger': $v.formData.gender.$error }">
      <label class="radio-label" for="female">Female</label><br>
      <div class="error" 
        v-if="$v.formData.gender.$error">
        <p v-if="!$v.formData.gender.required">You must select gender</p>
      </div>
    </section>

    <section class="form-field">
      <label for="input-age">Age</label>
      <input type="number" id="input-age" name="age" 
        v-model="$v.formData.age.$model"
        :class="{ 'bg-danger': $v.formData.age.$error }">
      <div class="error" 
        v-if="$v.formData.age.$error">
        <p v-if="!$v.formData.age.required">Age cannot be empty</p>
        <p v-if="!$v.formData.age.numeric">Age must be a number</p>
      </div>
    </section>

    <section class="form-field">
      <label for="input-birthday">Birthday</label>
      <input type="date" id="input-birthday" name="birthday" 
        v-model.lazy.trim="$v.formData.birthday.$model"
        :class="{ 'bg-danger': $v.formData.birthday.$error }">
      <div class="error" 
        v-if="$v.formData.birthday.$error">
        <p v-if="!$v.formData.birthday.required">Birthday cannot be empty</p>
      </div>
    </section>

    <section class="form-field">
      <label for="input-place-of-birth">Place of Birth</label>
      <input type="text" id="input-place-of-birth" name="placeOfBirth" 
        v-model.lazy.trim="$v.formData.placeOfBirth.$model"
        :class="{ 'bg-danger': $v.formData.placeOfBirth.$error }">
      <div class="error" 
        v-if="$v.formData.placeOfBirth.$error">
        <p v-if="!$v.formData.placeOfBirth.required">Place of Birth cannot be empty</p>
        <p v-if="!$v.formData.placeOfBirth.locationValidator">Place of Birth must contain only letters, numbers, commas, and hiphens</p>
      </div>
    </section>

    <section class="form-field">
      <label for="input-profile-picture-url">Profile picture URL</label>
      <input type="text" id="input-profile-picture-url" name="profilePictureUrl" 
        v-model.lazy.trim="$v.formData.profilePictureUrl.$model"
        :class="{ 'bg-danger': $v.formData.profilePictureUrl.$error }">
      <div class="error" 
        v-if="$v.formData.profilePictureUrl.$error">
        <p v-if="!$v.formData.profilePictureUrl.required">Profile picture URL cannot be empty</p>
        <p v-if="!$v.formData.profilePictureUrl.url">Profile picture URL must be a valid URL</p>
      </div>
    </section>

    <input type="submit" value="Add Actor">
    <input type="button" value="Cancel" 
      @click="handleClear">
    <Spinner class="spinner" 
      v-if="isLoading"/>
  </form> 
</template>

<script>
import Spinner from "@/components/Spinner.vue"
import { required, numeric, url } from "vuelidate/lib/validators"

const locationValidator = (value) => {
  if (value.trim().length === 0)
    return true  // Caught by `required` validator
  const locationRegex = /^[a-zA-Z0-9,\s-]+$/g
  return value.match(locationRegex) != null
}

const nameValidator = (value) => {
  if (value.trim().length === 0)
    return true  // Caught by `required` validator
  const nameRegex = /^[a-zA-Z\s-]+$/g
  return value.match(nameRegex) != null
}

export default {
  components: {
    Spinner
  },
  data: () => {
    return {
      isLoading: false,
      restError: "",
      infoMessage: "",
      formData: {
        name: "",
        gender: "",
        age: "",
        birthday: "",
        placeOfBirth: "",
        profilePictureUrl: ""
      }
    }
  },
  validations: {
    formData: {
      name: { 
        required,
        nameValidator
      },
      age: { 
        required,
        numeric
      },
      gender: {
        required
      },
      birthday: {
        required
      },
      profilePictureUrl: {
        required,
        url
      },
      placeOfBirth: {
       required,
       locationValidator
      }
    }
  },
  methods: {
    handleAddActor: function() {
      this.isLoading = true
      this.$v.$touch()
      const { formData } =  this.$v
      if (formData.$anyError || !formData.$dirty) {
        this.isLoading = false
        return
      }

      fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/actors", {
        method: "POST",
        headers: {
          'Content-Type': "application/json",
          'user-token': this.$store.getters.getUserToken
        },
        body: JSON.stringify({
          'name': formData.name.$model,
          'gender': formData.gender.$model,
          'birthday': formData.birthday.$model,
          'age': parseInt(formData.age.$model),
          'place_of_birth': formData.placeOfBirth.$model,
          'profile_picture_url': formData.profilePictureUrl.$model
        })
      }).then(resp => {
        this.isLoading = false
        if (!resp.ok)
          this.restError = `Server returned ${resp.status}: ${resp.statusText}`
        else
          this.infoMessage = "Actor added successfully"
      }).catch(err => {
        this.isLoading = false
        this.restError = err
      })
    },
    handleClear: function() {
      Object.keys(this.formData).forEach(k => {
        this.formData[k] = ""
      })
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
