<template>
  <div class="person-card">
    <section class="person-card__profile-picture">
      <router-link :to="'/person/' + personId">
        <img :src="profilePictureUrl" :alt="profilePictureUrlAlt" />
      </router-link>
    </section>
    <section class="person-card__content">
      <h3 class="person-card__title">
        <router-link :to="'/person/' + personId">{{ name }}</router-link>
      </h3>
      <div class="person-card__known-for">{{ knownForString }}</div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  props: {
    name: String,
    knownFor: Array,
    profilePictureUrl: String,
    personId: String
  },
  computed: {
    knownForString: function() {
      if (this.knownFor == undefined)
        return "-"

      const knownForStr = this.knownFor.join(", ")
      return knownForStr.length > 35 ? knownForStr.substring(0, 35) + "..." : knownForStr
    },
    profilePictureUrlAlt: function() {
      return `Alt for ${name}'s photo`
    }
  }
}
</script>

<style scoped>
h5 {
  padding: 0;
  margin: 0;
}
.person-card {
  position: relative;
  width: 233px;
  height: 288px;
  background-color: #fff;
  box-shadow: 4px 4px 10px 4px rgba(0,0,0,0.1);
}
.person-card img {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.person-card__profile-picture {
  height: 235px;
}
.person-card__title {
  margin: 0;
  padding: 0;
}
.person-card__title a {
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  color: #000;
}
.person-card__title a:hover {
  color: #6666ff;
}

.person-card__content {
  padding: 8px 10px;
}
.person-card__known-for {
  font-size: 13px;
  color: rgba(0,0,0,0.6)
}
</style>
