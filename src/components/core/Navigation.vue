<template>
  <nav>
    <ul class="main-navigation">
      <li
        v-for="(link, idx) in filteredSubpageLinks"
        :key="idx"
        class="nav__button"
      >
        <router-link :to="link.to">
          {{ link.name }}
        </router-link>
      </li>
    </ul>
    <ul class="login-register"
        v-if="!isUserLogged">
      <li
        v-for="(link, idx) in userManagementLinks"
        :key="idx"
        class="nav__button"
      >
        <router-link :to="link.to">
          {{ link.name }}
        </router-link>
      </li>
    </ul>
    <ul class="logout"
      v-else>
      <li class="nav__button">
        <router-link to="/logout">
          Logout
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
const protectionLevels = {
  USER: 0,
  ADMIN: 1
}

export default {
  data: () => ({
    subpageLinks: [
      {
        'name': "Movies",
        'to': "/movies",
        'protected': false
      },
      {
        'name': "People",
        'to': "/people",
        'protected': false
      },
      {
        'name': "Favourite Movies",
        'to': "/movies/favourite",
        'protected': true,
        'protectionLevel': protectionLevels.USER
      },
      {
        'name': "Add Actor",
        'to': "/actor/add",
        'protected': true,
        'protectionLevel': protectionLevels.ADMIN
      },
      {
        'name': "Add Movie",
        'to': "/movies/add",
        'protected': true,
        'protectionLevel': protectionLevels.ADMIN
      }
    ],
    userManagementLinks: [
      {
        'name': "Login",
        'to': "/login"
      },
      {
        'name': "Register",
        'to': "/register"
      }
    ]
  }),
  computed: {
    isUserLogged: function() {
      if (this.$store.getters.getUserToken == null)
        return false

      return true
    },
    filteredSubpageLinks: function() {
      return this.subpageLinks.filter((link) => {
        if (link.protected) {
          const isAllowed = (link.protectionLevel == protectionLevels.ADMIN && this.isUserLogged && this.$store.getters.getIsAdmin) || (link.protectionLevel == protectionLevels.USER && this.isUserLogged)
          if (isAllowed)
            return true
          return false
        }
          
        return true
      })
    }
  }
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
