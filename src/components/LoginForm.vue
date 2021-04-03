<template>
  <form action="/login" @submit.prevent="handleLogin">
    <div class="error"
      v-if="restError"
      @click="restError = ''"
    >
      {{ restError }}
    </div>
    <div class="error" v-if="false">
      <p>Username or password is incorrect</p>
    </div>
    <FormInput type="text" label="Username" name="username" v-model="formData.username" :v="$v.formData.username" :errorMessages="errorMessages.username" />

    <FormInput type="password" label="Password" name="password" v-model="formData.password" :v="$v.formData.password" :errorMessages="errorMessages.password" />

    <input type="submit" value="Login" @click="handleLogin">
    <input type="button" value="Reset password">
    <Spinner class="spinner" 
      v-if="isLoading"/>
  </form> 
</template>

<script>
import FormInput from "@/components/FormInput.vue"
import Spinner from "@/components/Spinner.vue"
import { required } from "vuelidate/lib/validators"
export default {
  components: {
    FormInput,
    Spinner
  },
  data: () => {
    return {
      isLoading: false,
      restError: "",
      formData: {
        username: "",
        password: "",
      },
      errorMessages: {}
    }
  },
  validations: {
    formData: {
      username: { 
        required
      },
      password: { 
        required
      }
    }
  },
  created: function() {
    this.errorMessages = {
      'username': {
        required: "Username cannot be empty",
      },
      'password': {
        required: "Password cannot be empty",
      }
    }
  },
  methods: {
    handleLogin: function() {
      this.$v.$touch()
      const { formData } =  this.$v
      this.isLoading = true
      if (formData.$anyError || !formData.$dirty) {
        this.isLoading = false
        return
      }

      fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'login': formData.username.$model,
          'password': formData.password.$model
        })
      }).then(resp => {
        this.isLoading = false
        if (resp.status == 401)
          throw new Error("Ivalid username or password")
        else if (!resp.ok)
          throw new Error(`Server returned ${resp.status}: ${resp.statusText}`)

        return resp.json()
      }).then(data => {
        this.$store.commit("setUserToken", data['user-token'])
        this.$store.commit("setLoginTime")
        return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/services/UserManagement/get-current-user-roles", {
          method: "GET",
          headers: {
            'Content-Type': "application/json",
            'user-token': this.$store.getters.getUserToken
          }
        })
      }).then(resp => {
        if (!resp.ok && resp.status >= 500)
          throw new Error({ 'status': resp.status, 'statusText': resp.statusText })
        else if (!resp.ok && resp.status < 500)
          return Promise.reject({ respData: resp })

        return resp.json()
      }).then(data => {
        this.$store.commit("setIsAdmin", data.includes("Admin"))
        this.$router.push("/")
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
</style>
