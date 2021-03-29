<template>
  <form action="/register" @submit.prevent="handleRegister">
    <div class="error"
      v-if="restError"
      @click="restError = ''"
    >
      {{ restError }}
    </div>
    <label for="input-username">Username</label>
    <input type="text" id="input-username" name="username" 
      v-model.lazy.trim="$v.formData.username.$model"
      :class="{ 'bg-danger': $v.formData.username.$error }">
      <div class="error" 
        v-if="$v.formData.username.$error">
        <p v-if="!$v.formData.username.required">Username cannot be empty</p>
        <p v-if="!$v.formData.username.minLength">Username must be at least {{ $v.formData.username.$params.minLength.min }} characters long</p>
        <p v-if="!$v.formData.username.alphaNum">Username must contain only letters and numbers</p>
      </div>

    <label for="input-password">Password (8 characters minimum)</label>
    <input type="password" id="input-password" name="password" 
      v-model="$v.formData.password.$model"
      :class="{ 'bg-danger': $v.formData.password.$error }">
      <div class="error" 
        v-if="$v.formData.password.$error">
        <p v-if="!$v.formData.password.required">Password cannot be empty</p>
        <p v-if="!$v.formData.password.minLength">Password must be at least {{ $v.formData.password.$params.minLength.min }} characters long</p>
      </div>

    <label for="input-password-confirm">Password Confirm</label>
    <input type="password" id="input-password-confirm" name="passwordConfirm" 
      v-model="$v.formData.passwordConfirm.$model"
      :class="{ 'bg-danger': $v.formData.passwordConfirm.$error }">
      <div class="error" 
        v-if="$v.formData.passwordConfirm.$error">
        <p v-if="!$v.formData.passwordConfirm.required">Password Confirm cannot be empty</p>
        <p v-if="!$v.formData.passwordConfirm.sameAsPassword">Password and Password Confirm differ</p>
      </div>

    <label for="input-email">Email</label>
    <input type="email" id="input-email" name="email" 
      v-model.lazy.trim="$v.formData.email.$model"
      :class="{ 'bg-danger': $v.formData.email.$error }">
      <div class="error" 
        v-if="$v.formData.email.$error">
        <p v-if="!$v.formData.email.required">Email cannot be empty</p>
        <p v-if="!$v.formData.email.email">Email has to be a valid email</p>
      </div>

    <input type="submit" value="Register">
    <input type="button" value="Cancel" 
      @click="handleClear">
    <Spinner class="spinner" 
      v-if="isLoading"/>
  </form> 
</template>

<script>
import Spinner from "@/components/Spinner.vue"
import { required, minLength, email, alphaNum, sameAs } from "vuelidate/lib/validators"
export default {
  components: {
    Spinner
  },
  data: () => {
    return {
      isLoading: false,
      restError: "",
      formData: {
        username: "",
        password: "",
        passwordConfirm: "",
        email: ""
      }
    }
  },
  validations: {
    formData: {
      username: { 
        required,
        alphaNum,
        minLength: minLength(6)
      },
      password: { 
        required,
        minLength: minLength(8)
      },
      passwordConfirm: { 
        required,
        sameAsPassword: sameAs("password")
      },
      email: { 
        required,
        email
      }
    }
  },
  methods: {
    handleRegister: function() {
      this.$v.$touch()
      const { formData } =  this.$v
      this.isLoading = true
      fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/users/register", {
        method: "POST",
        body: JSON.stringify({
          'username': formData.username.$model,
          'password': formData.password.$model,
          'email': formData.email.$model
        })
      }).then(resp => {
        this.isLoading = false
        if (!resp.ok)
          this.restError = `Server returned ${resp.status}: ${resp.statusText}`
        else
          this.$router.push("login")
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
input[type='password'],
input[type='email'] {
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
input[type='password']:focus,
input[type='email']:focus {
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
.spinner {
  margin: 0 15px;
}
</style>
