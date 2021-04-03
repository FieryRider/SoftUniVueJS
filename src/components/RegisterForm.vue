<template>
  <form action="/register" @submit.prevent="handleRegister">
    <div class="error"
      v-if="restError"
      @click="restError = ''"
    >
      {{ restError }}
    </div>

    <FormInput type="text" label="Username" name="username" v-model="formData.username" :v="$v.formData.username" :errorMessages="errorMessages.username" />

    <FormInput type="password" label="Password (8 characters minimum)" name="password" v-model="formData.password" :v="$v.formData.password" :errorMessages="errorMessages.password" />

    <FormInput type="password" label="Password Confirm" name="passwordConfirm" v-model="formData.passwordConfirm" :v="$v.formData.passwordConfirm" :errorMessages="errorMessages.passwordConfirm" />

    <FormInput type="email" label="Email" name="email" v-model="formData.email" :v="$v.formData.email" :errorMessages="errorMessages.email" />

    <input type="submit" value="Register">
    <input type="button" value="Cancel" 
      @click="handleClear">
    <Spinner class="spinner" 
      v-if="isLoading"/>
  </form> 
</template>

<script>
import FormInput from "@/components/FormInput.vue"
import Spinner from "@/components/Spinner.vue"
import { required, minLength, email, alphaNum, sameAs } from "vuelidate/lib/validators"
import { registerRequest } from "@/service/user_management"
export default {
  components: {
    FormInput,
    Spinner
  },
  data: function() {
    return {
      isLoading: false,
      restError: "",
      formData: {
        username: "",
        password: "",
        passwordConfirm: "",
        email: ""
      },
      errorMessages: {}
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
  created: function() {
    this.errorMessages = {
      username: {
        required: "Username cannot be empty",
        alphaNum: `Username must contain only letters and numbers` ,
        minLength: `Username must be at least ${this.$v.formData.username.$params.minLength.min} characters long`
      },
      password: {
        required: "Password cannot be empty",
        minLength: `Password must be at least ${ this.$v.formData.password.$params.minLength.min } characters long`
      },
      passwordConfirm: {
        required: "Password Confirm cannot be empty",
        sameAsPassword: "Password and Password Confirm differ"
      },
      email: {
        required: "Email cannot be empty",
        email: "Email has to be a valid email"
      }
    }
  },
  methods: {
    handleRegister: function() {
      this.$v.$touch()
      const { formData } =  this.$v
      this.isLoading = true
      if (formData.$anyError || !formData.$dirty) {
        this.isLoading = false
        return
      }

      registerRequest(formData.username.$model, formData.password.$model, formData.email.$model)
        .then(() => {
          this.isLoading = false
          this.$router.push("login")
        }).catch(err => {
          if ("respData" in err)
            return err.respData.json()
          this.isLoading = false
          this.restError = err
        }).then(data => {
          if (data !== undefined) {
            this.isLoading = false
            this.restError = JSON.stringify(data)
          }
        })
    },
    handleClear: function() {
      Object.keys(this.formData).forEach(k => {
        this.formData[k] = ""
      })
      this.$v.$reset()
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
.spinner {
  margin: 0 15px;
}
</style>
