<template>
  <div class="o-content-wrapper">
    <h2>Login with your account</h2>
    <p>
      In order to use the editing and rating capabilities of TMDb, as well as
      get personal recommendations you will need to login to your account. If
      you do not have an account, registering for an account is free and simple.
      Click here to get started.
    </p>
    <p>
      If you signed up but didn't get your verification email, click here to
      have it resent.
    </p>
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";

export default {
  components: {
    LoginForm,
  },
};
</script>

<style>
</style>
