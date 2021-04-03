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
    <FormInput type="text" label="Name" name="name" v-model="formData.name" :v="$v.formData.name" :errorMessages="errorMessages.name" />

    <section class="form-field">
      <label for="">Gender</label>
      <section class="radio-buttons">
        <FormInputRadio label="Male" name="gender" v-model="formData.gender" :v="$v.formData.gender" value="male" :errorMessages="errorMessages.gender" />
        <FormInputRadio label="Female" name="gender" v-model="formData.gender" :v="$v.formData.gender" value="female" :errorMessages="errorMessages.gender" />
      </section>
    </section>

    <FormInput type="number" label="Age" name="age" v-model="formData.age" :v="$v.formData.age" :errorMessages="errorMessages.age" />

    <FormInput type="date" label="Birthday" name="birthday" v-model="formData.birthday" :v="$v.formData.birthday" :errorMessages="errorMessages.birthday" />

    <FormInput type="text" label="Place of Birth" name="placeOfBirth" v-model="formData.placeOfBirth" :v="$v.formData.placeOfBirth" :errorMessages="errorMessages.placeOfBirth" />

    <FormInput type="text" label="Profile Picture URL" name="profilePictureUrl" v-model="formData.profilePictureUrl" :v="$v.formData.profilePictureUrl" :errorMessages="errorMessages.profilePictureUrl" />

    <FormInput type="textarea" label="Biography" name="biography" :rows="7" :cols="50" v-model="formData.biography" :v="$v.formData.biography" :errorMessages="errorMessages.biography" />

    <input type="submit" value="Add Actor">
    <input type="button" value="Cancel" 
      @click="handleClear">
    <Spinner class="spinner" 
      v-if="isLoading"/>
  </form> 
</template>

<script>
import Spinner from "@/components/Spinner.vue"
import FormInput from "@/components/FormInput.vue"
import FormInputRadio from "@/components/FormInputRadio.vue"
import { required, numeric, url } from "vuelidate/lib/validators"
import { addActorRequest } from "@/service/actor_management"

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
    FormInput,
    FormInputRadio,
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
        profilePictureUrl: "",
        biography: ""
      },
      errorMessages: {}
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
      },
      biography: {
        required
      }
    }
  },
  created: function() {
    this.errorMessages = {
      name: {
        required: "Name cannot be empty",
        nameValidator: "Name must contain only letters and numbers"
      },
      gender: {
        required: "You must select gender"
      },
      age: {
        required: "Age cannot be empty",
        numeric: "Age must be a number"
      },
      birthday: {
        required: "Birthday cannot be empty"
      },
      placeOfBirth: {
        required: "Place of Birth cannot be empty",
        locationValidator: "Place of Birth must contain only letters, numbers, commas, and hiphens"
      },
      profilePictureUrl: {
        required: "Profile picture URL cannot be empty",
        url: "Profile picture URL must be a valid URL"
      },
      biography: {
        required: "Biography cannot be empty"
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

      const actor = {
        'name': formData.name.$model,
        'gender': formData.gender.$model,
        'birthday': formData.birthday.$model,
        'age': parseInt(formData.age.$model),
        'place_of_birth': formData.placeOfBirth.$model,
        'profile_picture_url': formData.profilePictureUrl.$model,
        'biography': formData.biography.$model
      }
      addActorRequest(actor, this.$store.getters.getUserToken)
        .then(() => {
          this.isLoading = false
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
.radio-buttons {
  margin: 4px 0;
  display: flex;
}
.radio-buttons section:not(:first-child) {
  margin-left: 20px
}
</style>
