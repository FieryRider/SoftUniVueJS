<template>
  <nav>
    <ul class="main-navigation">
      <li
        v-for="link in subpageLinks"
        :key="link.name"
        class="nav__button"
      >
        <a :href="link.to">
          {{ link.name }}
        </a>
      </li>
    </ul>
    <ul class="login-register">
      <li
        v-for="link in userManagementLinks"
        :key="link.name"
        class="nav__button"
      >
        <a :href="link.to">
          {{ link.name }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data: () => ({
    subpageLinks: [
      {
        'name': "Movies",
        'to': "/"
      },
      {
        'name': "TV Shows",
        'to': "/"
      },
      {
        'name': "People",
        'to': "/"
      },
      {
        'name': "More",
        'to': "/"
      }
    ],
    userManagementLinks: [
      {
        'name': "Login",
        'to': "/"
      },
      {
        'name': "Register",
        'to': "/"
      }
    ]
  })
}
</script>

<style>
ul {
  padding: 0;
  margin: 0;
}
nav {
  width: 100%;
}
nav,
.main-navigation,
.login-register {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}
.main-navigation,
.login-register {
  height: 100%;
  list-style: none;
}
.nav__button {
  will-change: box-shadow;
  font-size: 0.875rem;
  font-weight: bolder;
  letter-spacing: 0.0892857143em;
  text-indent: 0.0892857143em;
  text-transform: uppercase;

  outline: 0;
  outline-width: 0px;
  transition-duration: 0.28s;
  transition-property: background-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}
.nav__button:hover {
  background-color: rgba(255,255,255,0.1);
  /* box-shadow: 0px 0px 15px 5px rgba(0,0,0,0.3); */
}
.nav__button a {
  display: inline-block;
  padding: 24px 16px;
  color: #fff !important;
  text-decoration: none;
}
</style>
