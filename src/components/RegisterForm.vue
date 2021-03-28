<template>
  <form action="/register" @submit.prevent="handleRegister">
    <label for="input-username">Username</label>
    <input type="text" id="input-username" name="username" v-model.lazy.trim="formData.username">
    <label for="input-password">Password (4 characters minimum)</label>
    <input type="password" id="input-password" name="password" v-model="formData.password">
    <label for="input-password-confirm">Password Confirm</label>
    <input type="password" id="input-password-confirm" name="passwordConfirm" v-model="formData.passwordConfirm">
    <label for="input-email">Email</label>
    <input type="email" id="input-email" name="email" v-model.lazy.trim="formData.email">
    <input type="submit" value="Register">
    <input type="button" value="Cancel" @click="handleClear">
    <Spinner class="spinner" v-if="isLoading"/>
  </form> 
</template>

<script>
import Spinner from "@/components/Spinner.vue"
export default {
  components: {
    Spinner
  },
  data: () => {
    return {
      isLoading: false,
      formData: {
        username: "",
        password: "",
        passwordConfirm: "",
        email: ""
      }
    }
  },
  methods: {
    handleRegister: function() {
      this.isLoading = true
      fetch("/register", {
        method: "POST",
        body: JSON.stringify(this.formData)
      }).then(resp => {
        if (!resp.ok)
          console.error(resp.status)
        else
          console.log(resp)
      }).catch(err => {
        console.error(err)
      })
      this.isLoading = false
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
