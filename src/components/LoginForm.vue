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
    <label for="input-username">Username</label>
    <input type="text" id="input-username" name="username"
      v-model.lazy.trim="$v.formData.username.$model">
    <label for="password">Password</label>
    <input type="password" id="input-password" name="password"
      v-model.lazy="$v.formData.password.$model">
    <input type="submit" value="Login" @click="handleLogin">
    <input type="button" value="Reset password">
    <Spinner class="spinner" 
      v-if="isLoading"/>
  </form> 
</template>

<script>
import Spinner from "@/components/Spinner.vue"
import { required } from "vuelidate/lib/validators"
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
      }
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
  methods: {
    handleLogin: function() {
      this.$v.$touch()
      const { formData } =  this.$v
      this.isLoading = true
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
        fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/services/UserManagement/get-current-user-roles", {
          method: "GET",
          headers: {
            'Content-Type': "application/json",
            'user-token': this.$store.getters.getUserToken
          }
        }).then(resp => {
          if (!resp.ok)
            throw new Error(`Server returned ${resp.status}: ${resp.statusText}`)

          return resp.json()
        }).then(data => {
          this.$store.commit("setIsAdmin", data.includes("Admin"))
          this.$router.push("/")
        })
      })
        .catch(err => {
        this.isLoading = false
        this.restError = err
      })
    }
  }
}
</script>

<style scoped>
input[type='text'],
input[type='password'] {
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
input[type='password']:focus {
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
</style>
